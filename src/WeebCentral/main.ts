import {
	Chapter,
	ChapterDetails,
	ChapterProviding,
	Extension,
	DiscoverSection,
	DiscoverSectionItem,
	DiscoverSectionType,
	MangaProviding,
	PagedResults,
	Request,
	Response,
	SearchQuery,
	SearchResultItem,
	SearchResultsProviding,
	SettingsFormProviding,
	SourceManga,
	TagSection,
	PaperbackInterceptor,
	BasicRateLimiter,
	Form,
	CloudflareBypassRequestProviding,
	Cookie,
	CookieStorageInterceptor,
	CloudflareError,
	SearchFilter,
} from "@paperback/types";
import { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";
import {
	isLastPage,
	parseChapterDetails,
	parseChapterList,
	parseMangaDetails,
	parseSearch,
	parseTags,
	parseViewMore,
} from "./WeebCentralParser";
import {
	getEnableProxyServer,
	getProxyAccess,
	getProxyServer,
	WeebCentralSettingsForm,
} from "./WeebCentralSettings";

const WEEBCENTRAL_DOMAIN = "https://weebcentral.com";

type WeebCentralImplementation = Extension &
	SearchResultsProviding &
	MangaProviding &
	ChapterProviding &
	SettingsFormProviding &
	CloudflareBypassRequestProviding;

class WeebCentralInterceptor extends PaperbackInterceptor {
	override async interceptRequest(request: Request): Promise<Request> {
		request.headers = {
			...(request.headers ?? {}),
			...{
				referer: `${WEEBCENTRAL_DOMAIN}/`,
				"user-agent": await Application.getDefaultUserAgent(),
			},
		};
		return request;
	}

	override async interceptResponse(
		request: Request,
		response: Response,
		data: ArrayBuffer
	): Promise<ArrayBuffer> {
		return data;
	}
}

export class WeebCentralExtension implements WeebCentralImplementation {
	globalRateLimiter = new BasicRateLimiter("rateLimiter", {
		numberOfRequests: 4,
		bufferInterval: 1,
		ignoreImages: true,
	});
	mainRequestInterceptor = new WeebCentralInterceptor("main");
	cookieStorageInterceptor = new CookieStorageInterceptor({
		storage: "stateManager",
	});

	async initialise(): Promise<void> {
		this.globalRateLimiter.registerInterceptor();
		this.mainRequestInterceptor.registerInterceptor();
		this.cookieStorageInterceptor.registerInterceptor();

		if (Application.isResourceLimited) return;

		Application.registerSearchFilter({
			id: "includeOperator",
			type: "dropdown",
			options: [
				{ id: "AND", value: "AND" },
				{ id: "OR", value: "OR" },
			],
			value: "AND",
			title: "Include Operator",
		});

		Application.registerSearchFilter({
			id: "excludeOperator",
			type: "dropdown",
			options: [
				{ id: "AND", value: "AND" },
				{ id: "OR", value: "OR" },
			],
			value: "OR",
			title: "Exclude Operator",
		});

		for (const tags of await this.getSearchTags()) {
			Application.registerSearchFilter({
				type: "multiselect",
				options: tags.tags.map((x) => ({ id: x.id, value: x.title })),
				id: "tags-" + tags.id,
				allowExclusion: true,
				title: tags.title,
				value: {},
				allowEmptySelection: true,
				maximum: undefined,
			});
		}
	}

	async getSearchFilters(): Promise<SearchFilter[]> {
		const includeFilter: SearchFilter = {
			id: "includeOperator",
			type: "dropdown",
			options: [
				{ id: "AND", value: "AND" },
				{ id: "OR", value: "OR" },
			],
			value: "AND",
			title: "Include Operator",
		};

		const excludeFilter: SearchFilter = {
			id: "excludeOperator",
			type: "dropdown",
			options: [
				{ id: "AND", value: "AND" },
				{ id: "OR", value: "OR" },
			],
			value: "OR",
			title: "Exclude Operator",
		};

		let tagFilter: SearchFilter = {
			type: "multiselect",
			options: [],
			id: "",
			allowExclusion: true,
			title: "",
			value: {},
			allowEmptySelection: true,
			maximum: undefined,
		};
		for (const tags of await this.getSearchTags()) {
			tagFilter.options = tags.tags.map((x) => ({
				id: x.id,
				value: x.title,
			}));
			tagFilter.id = "tags-" + tags.id;
			tagFilter.title = tags.title;
		}

		return [includeFilter, excludeFilter, tagFilter];
	}

	async getSettingsForm(): Promise<Form> {
		return new WeebCentralSettingsForm();
	}

	async getMangaDetails(mangaId: string): Promise<SourceManga> {
		const url = `${WEEBCENTRAL_DOMAIN}/series/${mangaId}`;
		const request = {
			url: url,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return parseMangaDetails($, mangaId, url);
	}

	async getChapters(sourceManga: SourceManga): Promise<Chapter[]> {
		const request = {
			url: `${WEEBCENTRAL_DOMAIN}/series/${sourceManga.mangaId}/full-chapter-list`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return parseChapterList($, sourceManga);
	}

	async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
		const chapterId = chapter.chapterId;
		const mangaId = chapter.sourceManga.mangaId;

		const request = {
			url: `${WEEBCENTRAL_DOMAIN}/chapters/${chapterId}/images?reading_style=long_strip`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		let chapters = parseChapterDetails($, mangaId, chapterId);

		let accessToken = getProxyAccess();
		let proxyURL = getProxyServer();
		let enableProxyServer = getEnableProxyServer();
		if (enableProxyServer && proxyURL != "") {
			let params = "?";
			for (const page in chapters.pages) {
				// @ts-expect-error
				params += `imageUrls=${chapters.pages[page].replace(
					"?undefined",
					""
				)}&`;
			}
			params = params.slice(0, -1);
			const request = {
				url: `${proxyURL}/generic${params}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					referer: `${proxyURL}/`,
					Authorization: `Bearer ${accessToken}`,
				},
			};
			const [_, buffer] = await Application.scheduleRequest(request);
			const data = Application.arrayBufferToUTF8String(buffer);
			const json = typeof data === "string" ? JSON.parse(data) : data;
			chapters.pages = json.processedImages;
		}
		return chapters;
	}

	async getDiscoverSections(): Promise<DiscoverSection[]> {
		return [
			{
				id: "latest_releases",
				title: "Latest Releases",
				type: DiscoverSectionType.simpleCarousel,
			},
			{
				id: "popular_updates",
				title: "Popular Updates",
				type: DiscoverSectionType.simpleCarousel,
			},
			{
				id: "recommendation",
				title: "Recommendations",
				type: DiscoverSectionType.simpleCarousel,
			},
		];
	}

	async getDiscoverSectionItems(
		section: DiscoverSection,
		metadata: any
	): Promise<PagedResults<DiscoverSectionItem>> {
		const page: number = metadata?.page ?? 1;
		let param = "";
		switch (section.id) {
			case "popular_updates":
				metadata = {
					...metadata,
					page: page + 1,
				};
				break;
			case "latest_releases":
				metadata = undefined;
				break;
			case "recommendation":
				metadata = undefined;
				break;
			default:
				throw new Error(
					"Requested to getViewMoreItems for a section ID which doesn't exist"
				);
		}
		const request = {
			url: `${WEEBCENTRAL_DOMAIN}/${param}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		const manga = parseViewMore($, section.id);
		return {
			items: manga,
			metadata,
		};
	}

	async getSearchResults(
		query: SearchQuery,
		metadata: any
	): Promise<PagedResults<SearchResultItem>> {
		const LIMIT = 32;
		const offset = metadata?.offset ?? 0;
		const regex = /[!?()]/g;
		let searchParams = "";
		// Regular search
		if (query.title) {
			searchParams = searchParams.concat(
				encodeURI(`&text=${query.title.replace(regex, "") ?? ""}`)
			);
		}
		// Tag search
		else {
			let included = "";
			let excluded = "";
			for (const filter of query.filters) {
				if (filter.id.startsWith("tags")) {
					const tags = (filter.value ?? {}) as Record<
						string,
						"included" | "excluded"
					>;
					for (const tag of Object.entries(tags)) {
						switch (tag[1]) {
							case "excluded":
								excluded += `&excluded_tag=${excluded}${tag[0]}`;
								break;
							case "included":
								included += `&included_tag=${included}${tag[0]}`;
								break;
						}
					}
				}
			}
			searchParams.concat(
				`${included}${excluded}&limit=${LIMIT}&offset=${offset}`
			);
		}
		const request = {
			url: `${WEEBCENTRAL_DOMAIN}/search/data?sort=Best+Match&order=Ascending&display_mode=Full+Display${searchParams}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		const results = parseSearch($);
		metadata = isLastPage($) ? undefined : { offset: offset + LIMIT };
		return {
			items: results,
			metadata,
		};
	}

	async getSearchTags(): Promise<TagSection[]> {
		const request = {
			url: `${WEEBCENTRAL_DOMAIN}/search`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return parseTags($);
	}

	async fetchCheerio(request: Request): Promise<CheerioAPI> {
		const [response, data] = await Application.scheduleRequest(request);
		this.checkCloudflareStatus(response.status);
		return cheerio.load(Application.arrayBufferToUTF8String(data));
	}

	checkCloudflareStatus(status: number): void {
		if (status == 503 || status == 403) {
			throw new CloudflareError({
				url: WEEBCENTRAL_DOMAIN,
				method: "GET",
			});
		}
	}

	async saveCloudflareBypassCookies(cookies: Cookie[]): Promise<void> {
		for (const cookie of cookies) {
			if (
				cookie.name.startsWith("cf") ||
				cookie.name.startsWith("_cf") ||
				cookie.name.startsWith("__cf")
			) {
				this.cookieStorageInterceptor.setCookie(cookie);
			}
		}
	}
}

export const WeebCentral = new WeebCentralExtension();
