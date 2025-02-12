import {
	Chapter,
	ChapterDetails,
	SearchResultItem,
	SearchQuery,
	SourceManga,
	Tag,
	TagSection,
	ContentRating,
} from "@paperback/types";
import { relevanceScore } from "./RelevanceScore";

export class MangaBoxParser {
	parseManga = (
		$: any,
		source: any,
		query?: SearchQuery
	): SearchResultItem[] => {
		const mangaItems: { manga: SearchResultItem; relevance: number }[] = [];
		const collecedIds: string[] = [];

		for (const manga of $(source.mangaListSelector).toArray()) {
			const mangaId = $("a", manga).first().attr("href");
			const image = $("img", manga).first().attr("src")?.trim() ?? "";
			const title = Application.decodeHTMLEntities(
				$("a", manga).first().attr("title")?.trim() ?? ""
			);
			const subtitle =
				$(source.mangaSubtitleSelector, manga).first().text().trim() ??
				"";

			if (!mangaId || !title || collecedIds.includes(mangaId)) continue;
			collecedIds.push(mangaId);
			const partialManga: SearchResultItem = {
				mangaId: mangaId,
				imageUrl: image,
				title: title,
				subtitle: subtitle ? subtitle : "No Chapters",
			};

			let relevance = 0;
			if (query?.title) {
				relevance = relevanceScore(title, query.title);
			}

			mangaItems.push({
				manga: partialManga,
				relevance: relevance,
			});
		}

		mangaItems.sort((a, b) => b.relevance - a.relevance);
		return mangaItems.map((r) => r.manga);
	};

	parseMangaDetails = ($: any, mangaId: string, source: any): SourceManga => {
		const mangaRootSelector = $(source.mangaRootSelector);

		const image = $(source.mangaThumbnailSelector).attr("src") ?? "";

		const title: string = Application.decodeHTMLEntities(
			$(source.mangaTitleSelector, mangaRootSelector).text().trim()
		);

		const altTitles: string[] = [];

		// Alternative Titles
		for (const altTitle of $(
			source.mangaAltTitleSelector,
			mangaRootSelector
		)
			.text()
			?.split(/,|;|\//)) {
			if (altTitle == "") continue;
			altTitles.push(Application.decodeHTMLEntities(altTitle.trim()));
		}

		const rawStatus =
			$(source.mangaStatusSelector, mangaRootSelector).text().trim() ??
			"ONGOING";
		let status = "ONGOING";
		switch (rawStatus.toUpperCase()) {
			case "ONGOING":
				status = "Ongoing";
				break;
			case "COMPLETED":
				status = "Completed";
				break;
			default:
				status = "Ongoing";
				break;
		}

		const author =
			$(source.mangaAuthorSelector, mangaRootSelector)
				.toArray()
				.map((x: any) => $(x).text().trim())
				.join(", ") ?? "";

		const desc = Application.decodeHTMLEntities(
			$(source.mangaDescSelector)
				.first()
				.children()
				.remove()
				.end()
				.text()
				.trim()
		);

		const tags: Tag[] = [];
		for (const tag of $(
			source.mangaGenresSelector,
			mangaRootSelector
		).toArray()) {
			const id = $(tag).attr("href");
			const label = $(tag).text().trim();

			if (!id || !label) continue;
			tags.push({ id: id, title: label });
		}
		const TagSection: TagSection[] = [
			{
				id: "0",
				title: "genres",
				tags: tags.map((t) => t),
			},
		];

		const rating: number =
			(parseFloat(
				Application.decodeHTMLEntities(
					$("em:nth-child(2) > em > em:nth-child(1)").text().trim()
				)
			) *
				2) /
			10;

		return {
			mangaId: mangaId,
			mangaInfo: {
				thumbnailUrl: image,
				primaryTitle: title,
				secondaryTitles: altTitles,
				status: status,
				author: author ? author : "Unkown",
				synopsis: desc,
				tagGroups: TagSection,
				contentRating: ContentRating.EVERYONE,
				shareUrl: `${mangaId}`,
				rating: rating,
			},
		};
	};

	parseChapters = (
		$: any,
		sourceManga: SourceManga,
		source: any
	): Chapter[] => {
		const chapters: Chapter[] = [];
		const mangaId = sourceManga.mangaId;
		let sortingIndex = 0;

		for (const chapter of $(source.chapterListSelector).toArray()) {
			const id = $("a", chapter).attr("href") ?? "";
			if (!id) continue;

			const name = Application.decodeHTMLEntities(
				$("a", chapter).text().trim()
			);
			const time = this.parseDate(
				$(source.chapterTimeSelector, chapter).last().text().trim() ??
					""
			);

			let chapNum = 0;
			const chapRegex = id.match(/(?:chap.*)[-_](\d+\.?\d?)/);
			if (chapRegex && chapRegex[1])
				chapNum = Number(chapRegex[1].replace(/\\/g, "."));

			chapters.push({
				chapterId: id,
				chapNum: isNaN(chapNum) ? 0 : chapNum,
				volume: 0,
				title: name
					.replace(/^Chapter\s*(\d+(?:\.\d+)?)(?:\s*[-:]\s*)?/i, "")
					.trim(),
				version: "",
				publishDate: time,
				langCode: source.languageCode,
				sortingIndex: sortingIndex,
				sourceManga: sourceManga,
			});
			sortingIndex--;
		}

		// If there are no chapters, throw error to avoid losing progress
		if (chapters.length == 0) {
			throw new Error(
				`Couldn't find any chapters for mangaId: ${mangaId}!`
			);
		}

		return chapters.map((chapter) => {
			chapter.sortingIndex! += chapters.length;
			return chapter;
		});
	};

	parseChapterDetails = async (
		$: any,
		mangaId: string,
		chapterId: string,
		source: any
	): Promise<ChapterDetails> => {
		const pages: string[] = [];

		for (const img of $(source.chapterImagesSelector).toArray()) {
			let image = $(img).attr("src") ?? "";
			if (!image) image = $(img).attr("data-src") ?? "";
			if (!image)
				throw new Error(
					`Unable to parse image(s) for Chapter ID: ${chapterId}`
				);
			pages.push(image);
		}

		const chapterDetails = {
			id: chapterId,
			mangaId: mangaId,
			pages: pages,
		};

		return chapterDetails;
	};

	parseTags = ($: any, source: any): TagSection[] => {
		const genres: Tag[] = [];
		for (const genre of $(source.genreListSelector).toArray()) {
			const id = $(genre).attr("data-i");
			const label = $(genre).text().trim();
			if (!id || !label) continue;
			genres.push({ id: id, title: label });
		}

		const TagSection: TagSection[] = [
			{
				id: "0",
				title: "genres",
				tags: genres.map((t) => t),
			},
		];
		return TagSection;
	};

	parseDate = (date: string): Date => {
		let time: Date;
		let number = Number((/\d*/.exec(date) ?? [])[0]);
		number = number == 0 && date.includes("a") ? 1 : number;
		date = date.toUpperCase();
		if (
			date.includes("MINUTE") ||
			date.includes("MINUTES") ||
			date.includes("MINS")
		) {
			time = new Date(Date.now() - number * 60000);
		} else if (date.includes("HOUR") || date.includes("HOURS")) {
			time = new Date(Date.now() - number * 3600000);
		} else if (date.includes("DAY") || date.includes("DAYS")) {
			time = new Date(Date.now() - number * 86400000);
		} else if (date.includes("YEAR") || date.includes("YEARS")) {
			time = new Date(Date.now() - number * 31556952000);
		} else {
			time = new Date(date);
		}

		return time;
	};

	isLastPage = ($: any): boolean => {
		const currentPage = $(".page-select, .page_select").text();
		let totalPages = $(".page-last, .page_last").text();

		if (currentPage) {
			totalPages = (/(\d+)/g.exec(totalPages) ?? [""])[0];
			return +totalPages == +currentPage;
		}

		return true;
	};
}
