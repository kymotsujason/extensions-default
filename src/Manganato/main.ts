import {
	BasicRateLimiter,
	Chapter,
	ChapterDetails,
	ChapterProviding,
	Extension,
	MangaProviding,
	PagedResults,
	PaperbackInterceptor,
	Request,
	Response,
	SearchQuery,
	SearchResultItem,
	SearchResultsProviding,
	SourceManga,
	TagSection,
} from "@paperback/types";

import { MangaBoxParser } from "./MangaBoxParser";
import { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";

const MANGANATO_DOMAIN = "https://manganato.com";

type ManganatoImplementation = Extension &
	SearchResultsProviding &
	MangaProviding &
	ChapterProviding;

class ManganatoInterceptor extends PaperbackInterceptor {
	override async interceptRequest(request: Request): Promise<Request> {
		request.headers = {
			...(request.headers ?? {}),
			...{
				referer: `${MANGANATO_DOMAIN}/`,
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

export class ManganatoExtension implements ManganatoImplementation {
	// Website base URL. Eg. https://manganato.com
	baseURL: string = MANGANATO_DOMAIN;

	// Language code supported by the source.
	languageCode: string = "🇬🇧";

	// Path for manga list. Eg. https://manganato.com/genre-all the path is 'genre-all'
	mangaListPath: string = "genre-all";

	// Selector for manga in manga list.
	mangaListSelector: string =
		"div.panel-content-genres div.content-genres-item";

	// Selector for subtitle in manga list.
	mangaSubtitleSelector: string = "a.genres-item-chap.text-nowrap";

	// Selector for genre list items.
	genreListSelector =
		"div.advanced-search-tool-genres-list span.advanced-search-tool-genres-item";

	// Selector for status list items.
	statusListSelector =
		"div.advanced-search-tool-status select.advanced-search-tool-status-content option";

	// Root selector for getMangaDetails.
	mangaRootSelector = "div.panel-story-info, div.manga-info-top";

	// Selector for manga thumbnail.
	mangaThumbnailSelector = "span.info-image img, div.manga-info-pic img";

	// Selector for manga main title.
	mangaTitleSelector =
		"div.story-info-right h1, ul.manga-info-text li:first-of-type h1";

	// Selector for manga alternative titles.
	mangaAltTitleSelector =
		"div.story-info-right td:contains(Alternative) + td h2," +
		"ul.manga-info-text h2.story-alternative";

	// Selector for manga status.
	mangaStatusSelector =
		"div.story-info-right td:contains(Status) + td," +
		"ul.manga-info-text li:contains(Status)";

	// Selector for manga author.
	mangaAuthorSelector =
		"div.story-info-right td:contains(Author) + td a," +
		"ul.manga-info-text li:contains(Author) a";

	// Selector for manga description.
	mangaDescSelector = "div#panel-story-info-description, div#noidungm";

	// Selector for manga tags.
	mangaGenresSelector =
		"div.story-info-right td:contains(Genre) + td a," +
		"ul.manga-info-text li:contains(Genres) a";

	// Selector for manga chapter list.
	chapterListSelector =
		"div.panel-story-chapter-list ul.row-content-chapter li," +
		"div.manga-info-chapter div.chapter-list div.row";

	// Selector for manga chapter time updated.
	chapterTimeSelector = "span.chapter-time, span";

	// Selector for manga chapter images.
	chapterImagesSelector = "div.container-chapter-reader img";

	parser = new MangaBoxParser();

	globalRateLimiter = new BasicRateLimiter("rateLimiter", {
		numberOfRequests: 4,
		bufferInterval: 1,
		ignoreImages: true,
	});
	mainRequestInterceptor = new ManganatoInterceptor("main");

	async initialise(): Promise<void> {
		this.globalRateLimiter.registerInterceptor();
		this.mainRequestInterceptor.registerInterceptor();

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

	async getMangaDetails(mangaId: string): Promise<SourceManga> {
		const request = {
			url: `${mangaId}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return this.parser.parseMangaDetails($, mangaId, this);
	}

	async getChapters(sourceManga: SourceManga): Promise<Chapter[]> {
		const request = {
			url: `${sourceManga.mangaId}`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return this.parser.parseChapters($, sourceManga, this);
	}

	async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
		const chapterId = chapter.chapterId;
		const mangaId = chapter.sourceManga.mangaId;

		const request = {
			url: `${chapterId}`,
			method: "GET",
			cookies: {
				content_server: "server2",
			},
		};
		const $ = await this.fetchCheerio(request);
		return await this.parser.parseChapterDetails(
			$,
			mangaId,
			chapterId,
			this
		);
	}

	// override async getHomePageSections(
	// 	sectionCallback: (section: HomeSection) => void
	// ): Promise<void> {
	// 	const sections = [
	// 		{
	// 			request: App.createRequest({
	// 				url: new URLBuilder(this.baseURL)
	// 					.addPathComponent(this.mangaListPath)
	// 					.addQueryParameter("type", "latest")
	// 					.buildUrl(),
	// 				method: "GET",
	// 			}),
	// 			section: App.createHomeSection({
	// 				id: "latest",
	// 				title: "Latest Updates",
	// 				type: HomeSectionType.singleRowLarge,
	// 				containsMoreItems: true,
	// 			}),
	// 		},
	// 		{
	// 			request: App.createRequest({
	// 				url: new URLBuilder(this.baseURL)
	// 					.addPathComponent(this.mangaListPath)
	// 					.addQueryParameter("type", "newest")
	// 					.buildUrl(),
	// 				method: "GET",
	// 			}),
	// 			section: App.createHomeSection({
	// 				id: "newest",
	// 				title: "New Titles",
	// 				type: HomeSectionType.singleRowNormal,
	// 				containsMoreItems: true,
	// 			}),
	// 		},
	// 		{
	// 			request: App.createRequest({
	// 				url: new URLBuilder(this.baseURL)
	// 					.addPathComponent(this.mangaListPath)
	// 					.addQueryParameter("type", "topview")
	// 					.buildUrl(),
	// 				method: "GET",
	// 			}),
	// 			section: App.createHomeSection({
	// 				id: "topview",
	// 				title: "Most Popular",
	// 				type: HomeSectionType.singleRowNormal,
	// 				containsMoreItems: true,
	// 			}),
	// 		},
	// 	];

	// 	const promises: Promise<void>[] = [];

	// 	for (const section of sections) {
	// 		sectionCallback(section.section);
	// 		promises.push(
	// 			this.requestManager
	// 				.schedule(section.request, 1)
	// 				.then((response) => {
	// 					const $ = this.cheerio.load(response.data as string);
	// 					const items = this.parser.parseManga($, this);
	// 					section.section.items = items;
	// 					sectionCallback(section.section);
	// 				})
	// 		);
	// 	}
	// }

	// override async getViewMoreItems(
	// 	homePageSectionId: string,
	// 	metadata: any
	// ): Promise<PagedResults> {
	// 	const page: number = metadata?.page ?? 1;

	// 	const request = {
	// 		url: new URLBuilder(this.baseURL)
	// 			.addPathComponent(`${this.mangaListPath}/${page}`)
	// 			.addQueryParameter("type", homePageSectionId)
	// 			.buildUrl(),
	// 		method: "GET",
	// 	};
	// 	const $ = await this.fetchCheerio(request);
	// 	const results = this.parser.parseManga($, this);

	// 	metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined;
	// 	return {
	// 		results: results,
	// 		metadata: metadata,
	// 	};
	// }

	async supportsTagExclusion(): Promise<boolean> {
		return true;
	}

	async getSearchTags(): Promise<TagSection[]> {
		const request = {
			url: `${this.baseURL}/advanced_search`,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		return this.parser.parseTags($, this);
	}

	async getSearchResults(
		query: SearchQuery,
		metadata: any
	): Promise<PagedResults<SearchResultItem>> {
		const page: number = metadata?.page ?? 1;
		let url = `${this.baseURL}/advanced_search?keyw=${
			query.title
				?.replace(/[^a-zA-Z0-9 ]/g, "")
				.replace(/ +/g, "_")
				.toLowerCase() ?? ""
		}`;
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
							excluded += `&g_e_${excluded}${tag[0]}_`;
							break;
						case "included":
							included += `&g_i=_${included}${tag[0]}_`;
							break;
					}
				}
			}
		}
		url = `${url}${included}${excluded}&page=${page}`;

		const request = {
			url: url,
			method: "GET",
		};
		const $ = await this.fetchCheerio(request);
		const results = this.parser.parseManga($, this, query);

		metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined;
		return {
			items: results,
			metadata: metadata,
		};
	}

	async fetchCheerio(request: Request): Promise<CheerioAPI> {
		const [_, data] = await Application.scheduleRequest(request);
		return cheerio.load(Application.arrayBufferToUTF8String(data));
	}
}

export const Manganato = new ManganatoExtension();
