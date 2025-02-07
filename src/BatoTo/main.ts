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
} from "@paperback/types";
import { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";
import { BTLanguages, Metadata } from "./BatoToHelper";
import {
	isLastPage,
	parseChapterDetails,
	parseChapterList,
	parseMangaDetails,
	parseSearch,
	parseTags,
	parseThumbnailUrl,
	parseViewMore,
} from "./BatoToParser";
import {
	getEnableProxyServer,
	getProxyAccess,
	getProxyServer,
	getLanguageSearchFilter,
	getLanguages,
	BatotoSettingsForm,
	getLanguageHomeFilter,
} from "./BatoToSettings";

const BATO_DOMAIN = "https://batocomic.org";

type BatotoImplementation = Extension &
	SearchResultsProviding &
	MangaProviding &
	ChapterProviding &
	SettingsFormProviding &
	CloudflareBypassRequestProviding;

class BatotoInterceptor extends PaperbackInterceptor {
	override async interceptRequest(request: Request): Promise<Request> {
		request.headers = {
			...(request.headers ?? {}),
			...{
				referer: `${BATO_DOMAIN}/`,
				"user-agent": await Application.getDefaultUserAgent(),
			},
		};
		if (request.url.includes("mangaId=")) {
			const mangaId = request.url.replace("mangaId=", "");
			if (mangaId) request.url = await this.getThumbnailUrl(mangaId);
		}
		return request;
	}

	async getThumbnailUrl(mangaId: string): Promise<string> {
		const request = {
			url: `${BATO_DOMAIN}/series/${mangaId}`,
			method: "GET",
		};
		const [response, data] = await Application.scheduleRequest(request);
		if (response.status == 503 || response.status == 403) {
			throw new CloudflareError({ url: BATO_DOMAIN, method: "GET" });
		}
		const $ = cheerio.load(Application.arrayBufferToUTF8String(data));
		return parseThumbnailUrl($);
	}

	override async interceptResponse(
		request: Request,
		response: Response,
		data: ArrayBuffer
	): Promise<ArrayBuffer> {
		return data;
	}
}

export class BatoToExtension implements BatotoImplementation {
	globalRateLimiter = new BasicRateLimiter("rateLimiter", {
		numberOfRequests: 4,
		bufferInterval: 1,
		ignoreImages: true,
	});
	mainRequestInterceptor = new BatotoInterceptor("main");
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

	async getSettingsForm(): Promise<Form> {
		return new BatotoSettingsForm();
	}

	async getMangaDetails(mangaId: string): Promise<SourceManga> {
		const url = `${BATO_DOMAIN}/series/${mangaId}`;
		const request = {
			url: url,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return parseMangaDetails($, mangaId, url);
	}

	async getChapters(sourceManga: SourceManga): Promise<Chapter[]> {
		const request = {
			url: `${BATO_DOMAIN}/series/${sourceManga.mangaId}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return parseChapterList($, sourceManga);
	}

	async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
		const chapterId = chapter.chapterId;
		const mangaId = chapter.sourceManga.mangaId;

		const request = {
			url: `${BATO_DOMAIN}/chapter/${chapterId}`,
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
		];
	}

	async getDiscoverSectionItems(
		section: DiscoverSection,
		metadata: Metadata | undefined
	): Promise<PagedResults<DiscoverSectionItem>> {
		const page: number = metadata?.page ?? 1;
		let param = "";
		switch (section.id) {
			case "popular_updates":
				param = `?sort=views_d.za&page=${page}`;
				break;
			case "latest_releases":
				param = `?sort=update.za&page=${page}`;
				break;
			default:
				throw new Error(
					"Requested to getViewMoreItems for a section ID which doesn't exist"
				);
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const langHomeFilter: boolean = getLanguageHomeFilter() ?? false;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const langs: string[] = getLanguages() ?? BTLanguages.getDefault();
		param += langHomeFilter ? `&langs=${langs.join(",")}` : "";
		const request = {
			url: `${BATO_DOMAIN}/browse${param}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		const manga = parseViewMore($);
		metadata = !isLastPage($) ? { page: page + 1 } : undefined;
		return {
			items: manga,
			metadata,
		};
	}

	async getSearchResults(
		query: SearchQuery,
		metadata: Metadata | undefined
	): Promise<PagedResults<SearchResultItem>> {
		const page: number = metadata?.page ?? 1;
		let request;

		// Regular search
		if (query.title) {
			request = {
				url: `${BATO_DOMAIN}/search?word=${encodeURI(
					query.title ?? ""
				)}&page=${page}`,
				method: "GET",
			};
			// Tag Search
		} else {
			let url = `${BATO_DOMAIN}/browse?genres=`;
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
								excluded += `${excluded}${tag[0]},`;
								break;
							case "included":
								included += `${included}${tag[0]},`;
								break;
						}
					}
				}
			}
			excluded = excluded.slice(0, -1);
			included = included.slice(0, -1);
			request = {
				url: `${url}${included}|${excluded}&page=${page}`,
				method: "GET",
			};
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const langSearchFilter: boolean = getLanguageSearchFilter() ?? false;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const langs: string[] = getLanguages() ?? BTLanguages.getDefault();

		const $ = await this.fetchCheerio(request);
		const manga = parseSearch($, langSearchFilter, langs, query);

		metadata = !isLastPage($) ? { page: page + 1 } : undefined;
		return {
			items: manga,
			metadata,
		};
	}

	async getSearchTags(): Promise<TagSection[]> {
		return parseTags();
	}

	async fetchCheerio(request: Request): Promise<CheerioAPI> {
		const [response, data] = await Application.scheduleRequest(request);
		this.checkCloudflareStatus(response.status);
		return cheerio.load(Application.arrayBufferToUTF8String(data));
	}

	checkCloudflareStatus(status: number): void {
		if (status == 503 || status == 403) {
			throw new CloudflareError({ url: BATO_DOMAIN, method: "GET" });
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

export const BatoTo = new BatoToExtension();
