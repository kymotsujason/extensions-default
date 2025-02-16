import {
	Chapter,
	ChapterDetails,
	PagedResults,
	SourceManga,
	TagSection,
	Request,
	Response,
	SearchResultsProviding,
	MangaProviding,
	ChapterProviding,
	Extension,
	PaperbackInterceptor,
	BasicRateLimiter,
	CookieStorageInterceptor,
	SearchQuery,
	CloudflareError,
	Cookie,
	SearchResultItem,
	DiscoverSection,
	DiscoverSectionType,
	DiscoverSectionItem,
	CloudflareBypassRequestProviding,
	SearchFilter,
} from "@paperback/types";

import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";
import { Parser } from "./MadaraParser";

const KUNMANGA_DOMAIN = "https://kunmanga.com";

type KunmangaImplementation = Extension &
	SearchResultsProviding &
	MangaProviding &
	ChapterProviding &
	CloudflareBypassRequestProviding;

class KunmangaInterceptor extends PaperbackInterceptor {
	override async interceptRequest(request: Request): Promise<Request> {
		request.headers = {
			...(request.headers ?? {}),
			...{
				"user-agent": await Application.getDefaultUserAgent(),
				referer: `${KUNMANGA_DOMAIN}/`,
				origin: `${KUNMANGA_DOMAIN}/`,
				...(request.url.includes("wordpress.com") && {
					Accept: "image/avif,image/webp,*/*",
				}), // Used for images hosted on Wordpress blogs
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

export class KunmangaExtension implements KunmangaImplementation {
	baseUrl = KUNMANGA_DOMAIN;
	language = "🇬🇧";
	searchMangaSelector = "div.c-tabs-item > div";
	searchPagePathName = "page";
	chapterDetailsSelector = "div.reading-content > div> img";
	directoryPath = "manga";
	parser = new Parser();
	globalRateLimiter = new BasicRateLimiter("rateLimiter", {
		numberOfRequests: 4,
		bufferInterval: 1,
		ignoreImages: true,
	});
	mainRequestInterceptor = new KunmangaInterceptor("main");
	cookieStorageInterceptor = new CookieStorageInterceptor({
		storage: "stateManager",
	});

	async initialise(): Promise<void> {
		this.globalRateLimiter.registerInterceptor();
		this.mainRequestInterceptor.registerInterceptor();
		this.cookieStorageInterceptor.registerInterceptor();

		if (Application.isResourceLimited) return;
	}

	async getSearchFilters(): Promise<SearchFilter[]> {
		const filters: SearchFilter[] = [];

		filters.push({
			id: "includeOperator",
			type: "dropdown",
			options: [
				{ id: "AND", value: "AND" },
				{ id: "OR", value: "OR" },
			],
			value: "AND",
			title: "Include Operator",
		});

		filters.push({
			type: "multiselect",
			options: [],
			id: "",
			allowExclusion: true,
			title: "",
			value: {},
			allowEmptySelection: true,
			maximum: undefined,
		});

		for (const tags of await this.getSearchTags()) {
			filters.push({
				type: "multiselect",
				allowExclusion: true,
				value: {},
				allowEmptySelection: true,
				maximum: undefined,
				options: tags.tags.map((x) => ({
					id: x.id,
					value: x.title,
				})),
				id: "tags-" + tags.id,
				title: tags.title,
			});
		}

		return filters;
	}

	async getMangaDetails(mangaId: string): Promise<SourceManga> {
		const request = {
			url: `${KUNMANGA_DOMAIN}/?p=${mangaId}/`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);

		return this.parser.parseMangaDetails($, mangaId, this);
	}

	async getChapters(sourceManga: SourceManga): Promise<Chapter[]> {
		let mangaId = sourceManga.mangaId;
		let path = this.directoryPath;
		let slug = mangaId;

		const postData = await this.convertPostIdToSlug(Number(mangaId));
		path = postData.path;
		slug = postData.slug;

		const request = {
			url: `${KUNMANGA_DOMAIN}/${path}/${slug}/ajax/chapters`,
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		};
		const $ = await this.fetchCheerio(request);

		return this.parser.parseChapterList($, sourceManga, this);
	}

	async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
		const chapterId = chapter.chapterId;
		const mangaId = chapter.sourceManga.mangaId;
		let url: string;
		const slugData: any = await this.convertPostIdToSlug(Number(mangaId));
		url = `${KUNMANGA_DOMAIN}/${slugData.path}/${slugData.slug}/${chapterId}/?style=list`;

		const request = {
			url: url,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);

		return this.parser.parseChapterDetails(
			$,
			mangaId,
			chapterId,
			this.chapterDetailsSelector,
			this
		);
	}

	async getSearchTags(): Promise<TagSection[]> {
		let request;
		// Adding the fake query "the" since some source revert to homepage when none is given!
		request = {
			url: `${KUNMANGA_DOMAIN}/?s=the&post_type=wp-manga`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);

		return this.parser.parseTags($, true);
	}

	async getSearchResults(
		query: SearchQuery,
		metadata: any
	): Promise<PagedResults<SearchResultItem>> {
		// If we're supplied a page that we should be on, set our internal reference to that page. Otherwise, we start from page 0.
		const page = metadata?.page ?? 1;

		const request = this.constructSearchRequest(page, query);
		const $ = await this.fetchCheerio(request);
		const results = await this.parser.parseSearchResults($, this);

		const manga: SearchResultItem[] = [];
		for (const result of results) {
			const postId = await this.slugToPostId(result.slug, result.path);

			manga.push({
				mangaId: String(postId),
				imageUrl: result.image,
				title: result.title,
				subtitle: result.subtitle,
			});
		}
		metadata = results.length >= 10 ? { page: page + 1 } : undefined;

		return {
			items: manga,
			metadata: metadata,
		};
	}

	async getDiscoverSections(): Promise<DiscoverSection[]> {
		return [
			{
				id: "new_manga",
				title: "New Manga",
				type: DiscoverSectionType.simpleCarousel,
			},
			{
				id: "latest_releases",
				title: "Latest Releases",
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
			case "new_manga":
				param = `?m_orderby=new-manga`;
				break;
			case "latest_releases":
				param = `?m_orderby=latest`;
				break;
			default:
				throw new Error(
					"Requested to getViewMoreItems for a section ID which doesn't exist"
				);
		}
		const request = {
			url: `${KUNMANGA_DOMAIN}/manga/page/${page}/${param}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		const manga = await this.parser.parseHomeSection($, this);
		metadata = manga.length >= 10 ? { page: page + 1 } : undefined;
		return {
			items: manga,
			metadata,
		};
	}

	// Utility
	constructSearchRequest(page: number, query: SearchQuery): any {
		if (query.title == "") {
			let url = `${KUNMANGA_DOMAIN}/manga/${
				this.searchPagePathName
			}/${page.toString()}/?s=${encodeURIComponent(
				query?.title ?? ""
			)}&post_type=wp-manga&`;
			let included = "";
			for (const filter of query.filters) {
				if (filter.id.startsWith("tags")) {
					const tags = (filter.value ?? {}) as Record<
						string,
						"included"
					>;
					for (const tag of Object.entries(tags)) {
						switch (tag[1]) {
							case "included":
								included += `genre[]=${included}${tag[0]}&`;
								break;
						}
					}
				}
			}
			included = included.slice(0, -1);
			return {
				url: `${url}${included}`,
				method: "GET",
			};
		} else {
			return {
				url: `${KUNMANGA_DOMAIN}/manga/${
					this.searchPagePathName
				}/${page.toString()}/?s=${encodeURIComponent(
					query?.title?.replace(/'/g, "’") ?? ""
				)}&post_type=wp-manga`,
				method: "GET",
			};
		}
	}

	async slugToPostId(slug: string, path: string): Promise<string> {
		if (Application.getState(slug) == null) {
			const postId = await this.convertSlugToPostId(slug, path);

			const existingMappedSlug = Application.getState(postId);
			if (existingMappedSlug != null) {
				Application.setState(undefined, slug);
			}

			Application.setState(slug, postId);
			Application.setState(postId, slug);
		}

		const postId = Application.getState(slug);
		if (!postId) throw new Error(`Unable to fetch postId for slug:${slug}`);

		return postId as string;
	}

	async convertPostIdToSlug(postId: number) {
		const request = {
			url: `${KUNMANGA_DOMAIN}/?p=${postId}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);

		let parseSlug: any;
		// Step 1: Try to get slug from og-url
		parseSlug = String($('meta[property="og:url"]').attr("content"));

		// Step 2: Try to get slug from canonical
		if (!parseSlug.includes(KUNMANGA_DOMAIN)) {
			parseSlug = String($('link[rel="canonical"]').attr("href"));
		}

		if (!parseSlug || !parseSlug.includes(KUNMANGA_DOMAIN)) {
			throw new Error("Unable to parse slug!");
		}

		parseSlug = parseSlug.replace(/\/$/, "").split("/");

		const slug = parseSlug.slice(-1).pop();
		const path = parseSlug.slice(-2).shift();

		return { path, slug };
	}

	async convertSlugToPostId(slug: string, path: string): Promise<string> {
		// Credit to the MadaraDex team :-D
		const headRequest = {
			url: `${KUNMANGA_DOMAIN}/${path}/${slug}`,
			method: "HEAD",
		};
		const [headResponse, _] = await Application.scheduleRequest(
			headRequest
		);

		let postId: any;

		const postIdRegex = headResponse?.headers["Link"]?.match(/\?p=(\d+)/);
		if (postIdRegex && postIdRegex[1]) postId = postIdRegex[1];
		if (postId || !isNaN(Number(postId))) {
			return postId?.toString();
		} else {
			postId = "";
		}

		const request = {
			url: `${KUNMANGA_DOMAIN}/${path}/${slug}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);

		// Step 1: Try to get postId from shortlink
		postId = Number(
			$('link[rel="shortlink"]')?.attr("href")?.split("/?p=")[1]
		);

		// Step 2: If no number has been found, try to parse from data-post
		if (isNaN(postId)) {
			postId = Number($("a.wp-manga-action-button").attr("data-post"));
		}

		// Step 3: If no number has been found, try to parse from manga script
		if (isNaN(postId)) {
			const page = $.root().html();
			const match = page?.match(/manga_id.*\D(\d+)/);
			if (match && match[1]) {
				postId = Number(match[1]?.trim());
			}
		}

		if (!postId || isNaN(postId)) {
			throw new Error(
				`Unable to fetch numeric postId for this item! (path:${path} slug:${slug})`
			);
		}

		return postId.toString();
	}

	async fetchCheerio(request: Request): Promise<CheerioAPI> {
		const [response, data] = await Application.scheduleRequest(request);
		this.checkCloudflareStatus(response.status);
		return cheerio.load(Application.arrayBufferToUTF8String(data), {
			xml: {
				xmlMode: false,
				decodeEntities: false,
			},
		});
	}

	checkCloudflareStatus(status: number): void {
		if (status == 503 || status == 403) {
			throw new CloudflareError({ url: KUNMANGA_DOMAIN, method: "GET" });
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

export const Kunmanga = new KunmangaExtension();
