import {
	Chapter,
	ChapterDetails,
	ContentRating,
	SourceManga,
	Tag,
	TagSection,
	SearchQuery,
	SearchResultItem,
	DiscoverSectionItem,
} from "@paperback/types";
import { CheerioAPI } from "cheerio";

export const parseMangaDetails = (
	$: CheerioAPI,
	mangaId: string,
	url: string
): SourceManga => {
	const title = Application.decodeHTMLEntities(
		$("h1").first().text().trim() ?? ""
	);
	let altTitle: string[] = [];
	for (const altTitleObj of $(
		"section:nth-child(3) > ul > li:nth-child(2)"
	).toArray()) {
		const altTitleText = $(
			'strong:contains("Associated Name(s)")',
			altTitleObj
		)
			.text()
			.trim();
		if (altTitleText == "Associated Name(s)") {
			for (const altTitleElement of $("ul > li", altTitleObj).toArray()) {
				const parsedStatus = $(altTitleElement).text().trim();
				altTitle.push(Application.decodeHTMLEntities(parsedStatus));
			}
		}
	}

	const image = $("picture > img").attr("src") ?? "";
	const description = Application.decodeHTMLEntities(
		$(".whitespace-pre-wrap").text().trim()
	);
	const authors: string[] = [];
	for (const authorObj of $('strong:contains("Author")')
		.siblings()
		.toArray()) {
		const author = $("a", authorObj).text().trim();
		authors.push(author);
	}
	const author = authors.join(", ");
	const parsedStatus = $('strong:contains("Status")').next().text().trim();
	let status: string;
	switch (parsedStatus) {
		case "Ongoing":
			status = "Ongoing";
			break;
		case "Complete":
			status = "Completed";
			break;
		case "Canceled":
			status = "Dropped";
			break;
		case "Hiatus":
			status = "Hiatus";
			break;
		default:
			status = "Unknown";
	}
	const genres: Tag[] = [];
	for (const genreObj of $(
		"a",
		$('strong:contains("Tags(s)")').siblings()
	).toArray()) {
		const genre = $(genreObj).text().trim();
		const id = encodeURI(genre);
		genres.push({ id, title: genre });
	}
	const tagSections: TagSection[] = [
		{
			id: "0",
			title: "genres",
			tags: genres,
		},
	];

	return {
		mangaId: mangaId,
		mangaInfo: {
			primaryTitle: title,
			secondaryTitles: altTitle,
			thumbnailUrl: image,
			status: status,
			author: author,
			tagGroups: tagSections,
			synopsis: description,
			contentRating: ContentRating.EVERYONE,
			shareUrl: url,
		},
	};
};

export const parseChapterList = (
	$: CheerioAPI,
	sourceManga: SourceManga
): Chapter[] => {
	const mangaId = sourceManga.mangaId;
	const floatRegex = /(\d+\.\d+|\d+)/g;
	const chapters: Chapter[] = [];
	const arrChapters = $("a.flex.items-center").toArray();
	const types: Record<string, number> = {};
	let currTypeId = 0;
	let sortingIndex = 0;
	for (const chapterObj of arrChapters) {
		const chapterId: string =
			$(chapterObj).attr("href")?.replace(/\/$/, "")?.split("/").pop() ??
			"";
		if (!chapterId) continue;

		const time = new Date(
			$("time.opacity-50", chapterObj).attr("datetime") ?? ""
		);
		let chapName = $("span.grow.flex.gap-2 span", chapterObj)
			.first()
			.text()
			.trim();

		let chapNum = 0;
		let chapType = "";
		const matches = chapName.match(floatRegex);
		if (matches && matches[matches.length - 1]) {
			chapNum = parseFloat(matches[matches.length - 1] ?? "0");
			chapType = chapName
				.slice(0, -matches[matches.length - 1]!.length)
				.trim();
		}
		sortingIndex--;
		if (!(chapType in types)) {
			types[chapType] = currTypeId--;
		}
		chapters.push({
			chapterId: chapterId,
			title: chapName
				.replace(
					/^(Chapter|Episode|Round|Volume|Days)\s*(\d+(?:\.\d+)?)(?:\s*[-:]\s*)?/i,
					""
				)
				.trim(),
			chapNum: chapNum,
			publishDate: time,
			sortingIndex,
			langCode: "en",
			sourceManga: sourceManga,
		});
	}
	if (chapters.length == 0) {
		throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}`);
	}
	return chapters.map((chapter) => {
		chapter.sortingIndex! += chapters.length;
		return chapter;
	});
};

export const parseChapterDetails = (
	$: CheerioAPI,
	mangaId: string,
	chapterId: string
): ChapterDetails => {
	const pages: string[] = [];
	for (const img of $("img", "section.cursor-pointer").toArray()) {
		let image = $(img).attr("src") ?? "";
		if (!image) image = $(img).attr("data-src") ?? "";
		if (!image) continue;
		pages.push(image);
	}

	const chapterDetails = {
		id: chapterId,
		mangaId: mangaId,
		pages: pages,
	};
	return chapterDetails;
};

export const parseViewMore = (
	$: CheerioAPI,
	section: string
): DiscoverSectionItem[] => {
	const manga: DiscoverSectionItem[] = [];
	if (section === "latest_releases") {
		for (const hotObj of $(
			"article.flex.gap-4",
			"section.bg-base-200.max-w-7xl"
		).toArray()) {
			const id =
				$("a", hotObj)
					.first()
					.attr("href")
					?.replace(/\/$/, "")
					?.split("/")
					.slice(-2)[0] ?? "";
			const title =
				$("div.font-semibold", hotObj).first().text().trim() ?? "";
			const image = $("source", hotObj).first().attr("srcset") ?? "";
			const subtitle = $("span", hotObj).last().text().trim() ?? "";
			manga.push({
				type: "simpleCarouselItem",
				imageUrl: image,
				title: Application.decodeHTMLEntities(title),
				mangaId: id,
				subtitle: Application.decodeHTMLEntities(subtitle),
			});
		}
	} else if (section === "popular_updates") {
		for (const recentObj of $(
			"article",
			"section.cols-span-1.rounded"
		).toArray()) {
			const id =
				$("a.aspect-square", recentObj)
					.attr("href")
					?.replace(/\/$/, "")
					?.split("/")
					.slice(-2)[0] ?? "";
			const title = $("div.font-semibold", recentObj).text().trim() ?? "";
			const image =
				$("a img", recentObj).attr("src") ??
				$("a img", recentObj).attr("data-src") ??
				"";
			const subtitle = $("span", recentObj).last().text().trim() ?? "";
			manga.push({
				type: "simpleCarouselItem",
				imageUrl: image,
				title: Application.decodeHTMLEntities(title),
				mangaId: id,
				subtitle: Application.decodeHTMLEntities(subtitle),
			});
		}
	} else {
		for (const recommendationObj of $(
			".glide__slide:not(.glide__slide--clone)"
		).toArray()) {
			const id =
				$("a", recommendationObj)
					.attr("href")
					?.replace(/\/$/, "")
					?.split("/")
					.slice(-2)[0] ?? "";
			const title =
				$(".text-white", recommendationObj).text().trim() ?? "";
			const image =
				$("source", recommendationObj).first().attr("srcset") ??
				$("img", recommendationObj).attr("src") ??
				"";
			manga.push({
				type: "simpleCarouselItem",
				imageUrl: image,
				title: Application.decodeHTMLEntities(title),
				mangaId: id,
				subtitle: "",
			});
		}
	}
	return manga;
};

export const parseTags = ($: CheerioAPI): TagSection[] => {
	const genres: Tag[] = [];
	for (const genreObj of $(
		"span",
		$("fieldset.collapse-content").last()
	).toArray()) {
		const label = $(genreObj).text().trim();
		const id = label;
		genres.push({ id, title: label });
	}
	return [{ id: "0", title: "genres", tags: genres }];
};

export const parseSearch = ($: CheerioAPI): SearchResultItem[] => {
	const results: SearchResultItem[] = [];
	for (const item of $("article.flex.gap-4").toArray()) {
		const id =
			$("a", item).attr("href")?.split("/series/")[1]?.split("/")[0] ??
			"";
		if (id == "" || typeof id != "string") throw new Error("Id is empty");
		const title = $("a.link.link-hover", item).first().text().trim() ?? "";
		const image =
			$("img", item).attr("src") ?? $("img", item).attr("data-src") ?? "";
		results.push({
			imageUrl: image,
			title: Application.decodeHTMLEntities(title),
			mangaId: id,
			subtitle: "",
		});
	}
	return results;
};

export const parseThumbnailUrl = ($: any): string => {
	return $("div.attr-cover img").attr("src") ?? "";
};

export const isLastPage = ($: CheerioAPI): boolean => {
	return $('span:contains("View More Results...")').toArray().length == 0;
};
