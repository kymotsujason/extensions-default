import {
	BasicRateLimiter,
	ContentRating,
	DiscoverSection,
	DiscoverSectionItem,
	DiscoverSectionProviding,
	DiscoverSectionType,
	Extension,
	Form,
	MangaProviding,
	PagedResults,
	PaperbackInterceptor,
	Request,
	Response,
	SearchQuery,
	SearchResultItem,
	SettingsFormProviding,
	SourceManga,
	Tag,
	TagSection,
	MangaProgress,
	TrackedMangaChapterReadAction,
	ChapterReadActionQueueProcessingResult,
	Chapter,
	MangaProgressProviding,
} from "@paperback/types";
import {
	CountryCode,
	discoverSectionQuery,
	DiscoverSectionQueryVariables,
	MediaSort,
	searchQuery,
	SearchQueryVariables,
	titleViewQuery,
	TitleViewQueryVariables,
	mangaProgressQuery,
	MangaProgressQuery,
	getMangaProgressQuery,
	saveMangaProgressMutation,
	SaveMangaProgressVariables,
} from "./GraphQLQueries";
import { SettingsForm } from "./SettingsForm";
import { SourceForm } from "./SourceForm";
import { relevanceScore } from "./RelevanceScore";
import * as AnilistUser from "./anilist-user";
import { userProfileQuery } from "./GraphQLQueries";

const GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

export type AccessToken = {
	accessToken: string;
	tokenBody: any;
};

type AniListImplementation = Extension &
	DiscoverSectionProviding &
	MangaProviding &
	SettingsFormProviding &
	MangaProgressProviding;

class AniListInterceptor extends PaperbackInterceptor {
	override async interceptRequest(request: Request): Promise<Request> {
		return request;
	}

	override async interceptResponse(
		// @ts-expect-error
		request: Request,
		// @ts-expect-error
		response: Response,
		data: ArrayBuffer
	): Promise<ArrayBuffer> {
		return data;
	}
}

export class AniListExtension implements AniListImplementation {
	mainRateLimiter = new BasicRateLimiter("main", {
		numberOfRequests: 15,
		bufferInterval: 10,
		ignoreImages: true,
	});

	mainInterceptor = new AniListInterceptor("main");

	async initialise(): Promise<void> {
		this.mainRateLimiter.registerInterceptor();
		this.mainInterceptor.registerInterceptor();

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
	}

	parseAccessToken(accessToken: string | undefined): any | undefined {
		if (!accessToken) return undefined;

		const tokenBodyBase64 = accessToken.split(".")[1];
		if (!tokenBodyBase64) return undefined;

		const tokenBodyJSON = Buffer.from(tokenBodyBase64, "base64").toString(
			"ascii"
		);
		return JSON.parse(tokenBodyJSON);
	}

	saveAccessToken(accessToken: string | undefined): AccessToken | undefined {
		Application.setSecureState(accessToken, "access_token");
		this.refreshUserInfo();

		if (!accessToken) return undefined;

		return {
			accessToken,
			tokenBody: this.parseAccessToken(accessToken),
		};
	}

	getAccessToken(): AccessToken | undefined {
		const accessToken = Application.getSecureState("access_token") as
			| string
			| undefined;

		if (!accessToken) return undefined;

		return {
			accessToken,
			tokenBody: this.parseAccessToken(accessToken),
		};
	}

	getUserInfo(): AnilistUser.Viewer | undefined {
		return Application.getState("userInfo") as
			| AnilistUser.Viewer
			| undefined;
	}

	isLoggedIn(): boolean {
		return this.getUserInfo() != undefined;
	}

	async refreshUserInfo() {
		const accessToken = this.getAccessToken();
		if (accessToken == undefined) {
			return Application.setState(undefined, "userInfo");
		}
		const response = await this.makeRequest<any>(userProfileQuery);
		// @ts-ignore
		const userInfo = response.data.Viewer;
		Application.setState(userInfo, "userInfo");
	}

	async getSettingsForm(): Promise<Form> {
		return new SettingsForm(
			this.saveAccessToken,
			this.refreshUserInfo,
			this.getAccessToken,
			this.getUserInfo,
			this.parseAccessToken,
			this.makeRequest
		);
	}

	async getSearchResults(
		query: SearchQuery,
		metadata?: number
	): Promise<PagedResults<SearchResultItem>> {
		const variables: SearchQueryVariables = {
			page: metadata ?? 1,
			search: query.title,
		};

		return await this.getItems<SearchQueryVariables, SearchResultItem>(
			searchQuery,
			variables,
			metadata,
			query.title
		);
	}

	async getDiscoverSections(): Promise<DiscoverSection[]> {
		const trending_now: DiscoverSection = {
			id: "trending-now",
			title: "Trending Now",
			type: DiscoverSectionType.prominentCarousel,
		};

		const all_time_popular: DiscoverSection = {
			id: "all-time-popular",
			title: "All Time Popular",
			type: DiscoverSectionType.simpleCarousel,
		};

		const popular_manga: DiscoverSection = {
			id: "popular-manga",
			title: "Popular Manga",
			type: DiscoverSectionType.simpleCarousel,
		};

		const popular_manhwa: DiscoverSection = {
			id: "popular-manhwa",
			title: "Popular Manhwa",
			type: DiscoverSectionType.simpleCarousel,
		};

		const top_100_manga: DiscoverSection = {
			id: "top-100-manga",
			title: "Top 100 Manga",
			type: DiscoverSectionType.simpleCarousel,
		};

		return [
			trending_now,
			all_time_popular,
			popular_manga,
			popular_manhwa,
			top_100_manga,
		];
	}

	async getDiscoverSectionItems(
		section: DiscoverSection,
		metadata: number | undefined
	): Promise<PagedResults<DiscoverSectionItem>> {
		let sort: string;
		let countryOfOrigin: string | undefined;
		switch (section.id) {
			case "trending-now":
				sort = MediaSort.TRENDING_DESC;
				break;
			case "all-time-popular":
				sort = MediaSort.POPULARITY_DESC;
				break;
			case "popular-manga":
				sort = MediaSort.POPULARITY_DESC;
				countryOfOrigin = CountryCode.JP;
				break;
			case "popular-manhwa":
				sort = MediaSort.POPULARITY_DESC;
				countryOfOrigin = CountryCode.KR;
				break;
			case "top-100-manga":
				sort = MediaSort.SCORE_DESC;
				break;
		}

		const variables: DiscoverSectionQueryVariables = {
			page: metadata ?? 1,
			sort: [sort!],
			countryOfOrigin: countryOfOrigin,
		};

		return await this.getItems<
			DiscoverSectionQueryVariables,
			DiscoverSectionItem
		>(discoverSectionQuery, variables, metadata, section);
	}

	async getItems<queryVariablesType, resultItemsType>(
		query: string,
		queryVariables: queryVariablesType,
		metadata: number | undefined,
		search: string | DiscoverSection
	): Promise<PagedResults<resultItemsType>> {
		const result: { manga: resultItemsType; relevance: number }[] = [];

		const json = await this.makeRequest<queryVariablesType>(
			query,
			queryVariables,
			search
		);
		// @ts-ignore
		const searchResults = json.data.Page.media;

		for (const searchResult of searchResults) {
			let title =
				searchResult.title.userPreferred ??
				searchResult.title.english ??
				searchResult.title.native ??
				"No Title";
			let relevance = 0;
			if (typeof search == "string") {
				relevance = relevanceScore(title, search as string);
			}
			result.push({
				manga: {
					mangaId: searchResult.id!.toString(),
					title: title,
					imageUrl: searchResult.coverImage.large,
				} as resultItemsType,
				relevance: relevance,
			});
		}

		// @ts-ignore
		metadata = json.data.Page.pageInfo.hasNextPage
			? (metadata ?? 1) + 1
			: undefined;

		result.sort((a, b) => b.relevance - a.relevance);
		const items = result.map((r) => r.manga);
		return {
			items,
			metadata,
		};
	}

	async getMangaDetails(mangaId: string): Promise<SourceManga> {
		const variables: TitleViewQueryVariables = {
			id: +mangaId,
		};
		const json = await this.makeRequest<TitleViewQueryVariables>(
			titleViewQuery,
			variables
		);

		// @ts-ignore
		const mangaDetails = json.data.Media;

		const thumbnailUrl = mangaDetails.coverImage.extraLarge;
		const synopsis = mangaDetails.description
			? mangaDetails.description.replace(
					/<br>|<i>|<\/i>|<a.*?>|<\/a>/g,
					""
			  )
			: "No description";
		const secondaryTitles = [
			mangaDetails.title.romaji ?? "No Romaji Title",
			mangaDetails.title.english ?? "No English Title",
			mangaDetails.title.native ?? "No Native Title",
		];
		const primaryTitle =
			mangaDetails.title.userPreferred ??
			secondaryTitles.find((e) => e !== undefined) ??
			"No Title";
		let status;
		switch (mangaDetails.status) {
			case "FINISHED":
				status = "Finished";
				break;
			case "NOT_YET_RELEASING":
				status = "Not Yet Released";
				break;
			case "CANCELLED":
				status = "Canceled";
				break;
			case "HIATUS":
				status = "Hiatus";
				break;
			default:
				status = "Releasing";
		}
		let author;
		let artist;
		let exitLoop;
		for (const staff of mangaDetails.staff.edges) {
			switch (staff.role) {
				// @ts-expect-error
				case staff.role.startsWith("Story & Art"):
					artist = undefined;
					exitLoop = true;
				case staff.role.startsWith("Story") && !author:
				case staff.role.startsWith("Original Story") && !author:
					author = staff.node.name.full;
					break;
				case staff.role.startsWith("Art"):
					artist = staff.node.name.full;
					break;
				default:
					break;
			}
			if ((author && artist) || exitLoop) break;
		}
		const bannerUrl = mangaDetails.bannerImage;
		const rating = mangaDetails.averageScore
			? mangaDetails.averageScore / 100
			: undefined;
		const genres: Tag[] = [];
		for (const genre of mangaDetails.genres) {
			genres.push({
				id: genre.replace(" ", "-").toLowerCase(),
				title: genre,
			});
		}
		const tags: Tag[] = [];
		for (const tag of mangaDetails.tags) {
			genres.push({
				id: tag.id!.toString(),
				title: tag.name,
			});
		}
		const tagGroups: TagSection[] = [
			{ id: "genres", title: "Genres", tags: genres },
			{ id: "tags", title: "Tags", tags: tags },
		];
		const contentRating: ContentRating = mangaDetails.isAdult
			? ContentRating.ADULT
			: genres.some((e) => e.id === "ecchi")
			? ContentRating.MATURE
			: ContentRating.EVERYONE;
		const artworkUrls = [thumbnailUrl];

		return {
			mangaId: mangaId,
			mangaInfo: {
				thumbnailUrl,
				synopsis,
				primaryTitle,
				secondaryTitles,
				contentRating,
				status,
				artist,
				author,
				bannerUrl,
				rating,
				tagGroups,
				artworkUrls,
			},
		};
	}

	async getMangaProgress(
		sourceMangaInfo: SourceManga
	): Promise<MangaProgress | undefined> {
		const variables: MangaProgressQuery = {
			id: +sourceMangaInfo.mangaId,
		};
		const json = await this.makeRequest<MangaProgressQuery>(
			mangaProgressQuery,
			variables
		);

		// @ts-ignore
		const mangaDetails = json.data.Media;

		if (!mangaDetails?.mediaListEntry) {
			return undefined;
		}

		let lastReadChapter: Chapter = {
			chapterId: sourceMangaInfo.mangaId,
			sourceManga: sourceMangaInfo,
			langCode: "en",
			chapNum: mangaDetails?.mediaListEntry.progress + 1,
		};

		let lastReadDate = new Date(mangaDetails?.mediaListEntry.lastReadAt);
		let score = mangaDetails?.mediaListEntry.score;

		return {
			sourceManga: sourceMangaInfo,
			lastReadChapter: lastReadChapter,
			lastReadTime: lastReadDate,
			userRating: score,
		};
	}

	async getMangaProgressManagementForm(
		sourceMangaInfo: SourceManga
	): Promise<Form> {
		if (!this.isLoggedIn()) {
			return this.getSettingsForm();
		} else {
			const variables: MangaProgressQuery = {
				id: +sourceMangaInfo.mangaId,
			};
			const response = await this.makeRequest<MangaProgressQuery>(
				mangaProgressQuery,
				variables
			);

			// @ts-ignore
			const anilistManga = response.data.Media;

			return new SourceForm(
				anilistManga,
				this.makeRequest,
				this.getUserInfo,
				this.getAccessToken,
				this.parseAccessToken
			);
		}
	}

	async processChapterReadActionQueue(
		chapterReadActions: TrackedMangaChapterReadAction[]
	): Promise<ChapterReadActionQueueProcessingResult> {
		type PartialMediaListEntry = {
			mediaListEntry?: { progress?: number; progressVolumes?: number };
		};
		const anilistMangaCache: Record<
			string,
			PartialMediaListEntry | undefined
		> = {};
		let result: ChapterReadActionQueueProcessingResult = {
			successfulItems: [],
			failedItems: [],
		};

		for (const readAction of chapterReadActions) {
			try {
				let anilistManga =
					anilistMangaCache[readAction.sourceManga.mangaId];

				if (!anilistManga) {
					const variables: MangaProgressQuery = {
						id: +readAction.sourceManga.mangaId,
					};
					const _response =
						await this.makeRequest<MangaProgressQuery>(
							getMangaProgressQuery,
							variables
						);

					// @ts-expect-error
					anilistManga = _response.data.Media;
					anilistMangaCache[readAction.sourceManga.mangaId] =
						anilistManga;
				}

				if (anilistManga?.mediaListEntry) {
					// If the Anilist chapter is higher or equal, skip
					if (
						anilistManga.mediaListEntry.progress == undefined ||
						anilistManga.mediaListEntry.progress >=
							Math.floor(readAction.readChapter.chapNum)
					) {
						// @ts-expect-error
						result.successfulItems.push(readAction.id);
						continue;
					}
				} else {
					const id = undefined;
					// @ts-expect-error
					const mediaId = Number(anilistManga.id);
					const volume = readAction.readChapter.volume
						? Math.floor(readAction.readChapter.volume)
						: 1;
					const progress = Math.floor(readAction.readChapter.chapNum);

					let mutation = {
						id: id,
						mediaId: mediaId,
						status: "CURRENT",
						notes: "",
						progress: volume,
						progressVolumes: progress,
						repeat: 1,
						private: false,
						hiddenFromStatusLists: false,
						score: 0,
					};
					await this.makeRequest<SaveMangaProgressVariables>(
						saveMangaProgressMutation,
						mutation
					);
					continue;
				}
				let params = {
					mediaId: readAction.sourceManga.mangaId,
					progress: Math.floor(readAction.readChapter.chapNum),
					progressVolumes: readAction.readChapter.volume
						? Math.floor(readAction.readChapter.volume)
						: 1,
				};
				const response =
					await this.makeRequest<SaveMangaProgressVariables>(
						saveMangaProgressMutation,
						params
					);

				if (
					// @ts-ignore
					response.data.Media.mediaListEntry != null
				) {
					// @ts-expect-error
					result.successfulItems.push(readAction.id);
					if (anilistManga) {
						anilistManga.mediaListEntry = {
							progress: Math.floor(
								readAction.readChapter.chapNum
							),
							progressVolumes: readAction.readChapter.volume
								? Math.floor(readAction.readChapter.volume)
								: 1,
						};
						anilistMangaCache[readAction.sourceManga.mangaId] =
							anilistManga;
					}
				} else {
					// @ts-expect-error
					result.failedItems.push(readAction.id);
				}
			} catch (error) {
				// @ts-expect-error
				result.failedItems.push(readAction.id);
			}
		}
		return result;
	}

	async makeRequest<QueryVariablesType>(
		query: string,
		QueryVariables?: QueryVariablesType,
		search?: string | DiscoverSection
	): Promise<unknown> {
		const accessToken = this.getAccessToken()?.accessToken;
		const request = {
			url: GRAPHQL_ENDPOINT,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				...(accessToken != null
					? {
							Authorization: `Bearer ${accessToken}`,
					  }
					: {}),
			},
			body: JSON.stringify({
				query: query,
				variables: QueryVariables,
			}),
		};

		const [_, buffer] = await Application.scheduleRequest(request);
		const data = Application.arrayBufferToUTF8String(buffer);
		const json: unknown = JSON.parse(data);
		if (json == undefined) {
			throw new Error(
				`Failed to parse JSON for the ${
					typeof search === undefined
						? "title"
						: typeof search === "string"
						? 'given search "' + search + '"'
						: "section " + search
				}: ${json}`
			);
		} else if (
			typeof json === "object" &&
			json != null &&
			"errors" in json &&
			json.errors != null &&
			Array.isArray(json.errors)
		) {
			for (const error of json.errors) {
				if (
					typeof error === "object" &&
					error != null &&
					"status" in error &&
					error.status != null &&
					"message" in error &&
					error.message != null
				) {
					throw new Error(
						`AniList returned an error: [${error.status}] ${error.message}`
					);
				}
			}
		}

		return json;
	}
}

export const Anilist = new AniListExtension();
