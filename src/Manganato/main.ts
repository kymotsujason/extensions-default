import {
	Chapter,
	ChapterDetails,
	ChapterProviding,
	CompatWrapper,
	DUISection,
	HomePageSectionsProviding,
	HomeSection,
	HomeSectionType,
	MangaProviding,
	PagedResults,
	Request,
	Response,
	SearchRequest,
	SearchResultsProviding,
	Source,
	SourceManga,
	TagSection,
} from "@paperback/types/lib/compat/0.8";

import { MangaBoxParser } from "./MangaBoxParser";

import { URLBuilder } from "./MangaBoxHelpers";

import {
	chapterSettings,
	getEnableProxyServer,
	getImageServer,
	getProxyAccess,
	getProxyServer,
	proxySettings,
} from "./MangaBoxSettings";

import * as cheerios from "cheerio";

export class MangaBox
	extends Source
	implements
		SearchResultsProviding,
		MangaProviding,
		ChapterProviding,
		HomePageSectionsProviding
{
	// Website base URL. Eg. https://manganato.com
	baseURL: string = "https://manganato.com";

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

	stateManager = App.createSourceStateManager();

	requestManager = App.createRequestManager({
		requestsPerSecond: 3,
		requestTimeout: 20000,
		interceptor: {
			interceptRequest: async (request: Request): Promise<Request> => {
				request.headers = {
					...(request.headers ?? {}),
					...{
						referer: `${this.baseURL}/`,
						"user-agent":
							await this.requestManager.getDefaultUserAgent(),
					},
				};
				return request;
			},
			interceptResponse: async (
				response: Response
			): Promise<Response> => {
				return response;
			},
		},
	});

	override async getSourceMenu(): Promise<DUISection> {
		return App.createDUISection({
			id: "main",
			header: "Source Settings",
			isHidden: false,
			rows: async () => [
				chapterSettings(this.stateManager),
				proxySettings(this.stateManager, this.requestManager),
			],
		});
	}

	override getMangaShareUrl(mangaId: string): string {
		return `${mangaId}`;
	}

	override async getHomePageSections(
		sectionCallback: (section: HomeSection) => void
	): Promise<void> {
		const sections = [
			{
				request: App.createRequest({
					url: new URLBuilder(this.baseURL)
						.addPathComponent(this.mangaListPath)
						.addQueryParameter("type", "latest")
						.buildUrl(),
					method: "GET",
				}),
				section: App.createHomeSection({
					id: "latest",
					title: "Latest Updates",
					type: HomeSectionType.singleRowLarge,
					containsMoreItems: true,
				}),
			},
			{
				request: App.createRequest({
					url: new URLBuilder(this.baseURL)
						.addPathComponent(this.mangaListPath)
						.addQueryParameter("type", "newest")
						.buildUrl(),
					method: "GET",
				}),
				section: App.createHomeSection({
					id: "newest",
					title: "New Titles",
					type: HomeSectionType.singleRowNormal,
					containsMoreItems: true,
				}),
			},
			{
				request: App.createRequest({
					url: new URLBuilder(this.baseURL)
						.addPathComponent(this.mangaListPath)
						.addQueryParameter("type", "topview")
						.buildUrl(),
					method: "GET",
				}),
				section: App.createHomeSection({
					id: "topview",
					title: "Most Popular",
					type: HomeSectionType.singleRowNormal,
					containsMoreItems: true,
				}),
			},
		];

		const promises: Promise<void>[] = [];

		for (const section of sections) {
			sectionCallback(section.section);
			promises.push(
				this.requestManager
					.schedule(section.request, 1)
					.then((response) => {
						const $ = this.cheerio.load(response.data as string);
						const items = this.parser.parseManga($, this);
						section.section.items = items;
						sectionCallback(section.section);
					})
			);
		}
	}

	async getMangaDetails(mangaId: string): Promise<SourceManga> {
		const request = App.createRequest({
			url: `${mangaId}`,
			method: "GET",
		});

		const response = await this.requestManager.schedule(request, 1);
		const $ = this.cheerio.load(response.data as string);
		return this.parser.parseMangaDetails($, mangaId, this);
	}

	async getChapters(mangaId: string): Promise<Chapter[]> {
		const request = App.createRequest({
			url: `${mangaId}`,
			method: "GET",
		});

		const response = await this.requestManager.schedule(request, 1);
		const $ = this.cheerio.load(response.data as string);
		return this.parser.parseChapters($, mangaId, this);
	}

	async getChapterDetails(
		mangaId: string,
		chapterId: string
	): Promise<ChapterDetails> {
		const cookieDomainRegex = chapterId.match(/(https?:\/\/[^\\/]+\/)/g);
		const cookieDomain = cookieDomainRegex
			? cookieDomainRegex[0]
			: this.baseURL;
		const imageServer = await getImageServer(this.stateManager).then(
			(value) => value[0]
		);

		const request = App.createRequest({
			url: `${chapterId}`,
			method: "GET",
			cookies: [
				App.createCookie({
					name: "content_server",
					value: imageServer ?? "server1",
					domain: cookieDomain,
				}),
			],
		});

		const response = await this.requestManager.schedule(request, 1);
		const $ = this.cheerio.load(response.data as string);
		let chapters = await this.parser.parseChapterDetails(
			$,
			mangaId,
			chapterId,
			this
		);

		let accessToken = await getProxyAccess(this.stateManager);
		let proxyURL = await getProxyServer(this.stateManager);
		let enableProxyServer = await getEnableProxyServer(this.stateManager);
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
			const request = App.createRequest({
				url: `${proxyURL}/generic`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					referer: `${proxyURL}/`,
					Authorization: `Bearer ${accessToken}`,
				},
				param: params,
			});

			const response = await this.requestManager.schedule(request, 1);
			const json = JSON.parse(response.data as string);
			chapters.pages = json.processedImages;
		}
		return chapters;
	}

	override async getViewMoreItems(
		homePageSectionId: string,
		metadata: any
	): Promise<PagedResults> {
		const page: number = metadata?.page ?? 1;

		const request = App.createRequest({
			url: new URLBuilder(this.baseURL)
				.addPathComponent(`${this.mangaListPath}/${page}`)
				.addQueryParameter("type", homePageSectionId)
				.buildUrl(),
			method: "GET",
		});

		const response = await this.requestManager.schedule(request, 1);
		const $ = this.cheerio.load(response.data as string);
		const results = this.parser.parseManga($, this);

		metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined;
		return App.createPagedResults({
			results: results,
			metadata: metadata,
		});
	}

	override async supportsTagExclusion(): Promise<boolean> {
		return true;
	}

	override async getSearchTags(): Promise<TagSection[]> {
		const request = App.createRequest({
			url: new URLBuilder(this.baseURL)
				.addPathComponent("advanced_search")
				.buildUrl(),
			method: "GET",
		});

		const response = await this.requestManager.schedule(request, 1);
		const $ = this.cheerio.load(response.data as string);
		return this.parser.parseTags($, this);
	}

	async getSearchResults(
		query: SearchRequest,
		metadata: any
	): Promise<PagedResults> {
		const page: number = metadata?.page ?? 1;

		const request = App.createRequest({
			url: new URLBuilder(this.baseURL)
				.addPathComponent("advanced_search")
				.addQueryParameter(
					"keyw",
					query.title
						?.replace(/[^a-zA-Z0-9 ]/g, "")
						.replace(/ +/g, "_")
						.toLowerCase() ?? ""
				)
				.addQueryParameter(
					"g_i",
					`_${query.includedTags?.map((t) => t.id).join("_")}_`
				)
				.addQueryParameter(
					"g_e",
					`_${query.excludedTags?.map((t) => t.id).join("_")}_`
				)
				.addQueryParameter("page", page)
				.buildUrl(),
			method: "GET",
		});

		const response = await this.requestManager.schedule(request, 1);
		const $ = this.cheerio.load(response.data as string);
		const results = this.parser.parseManga($, this, query);

		metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined;
		return App.createPagedResults({
			results: results,
			metadata: metadata,
		});
	}
}

export const Manganato = CompatWrapper(
	{ registerHomeSectionsInInitialise: true },
	new MangaBox(cheerios)
);
