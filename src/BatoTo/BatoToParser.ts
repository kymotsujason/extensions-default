import {
	Chapter,
	ChapterDetails,
	HomeSection,
	HomeSectionType,
	PartialSourceManga,
	SearchRequest,
	SourceManga,
	Tag,
	TagSection,
} from "@paperback/types/lib/compat/0.8";
import CryptoJS from "crypto-js";
import { decode as decodeHTMLEntity } from "html-entities";
import { BTGenres, BTLanguages } from "./BatoToHelper";
import { relevanceScore } from "./RelevanceScore";

export const parseMangaDetails = ($: any, mangaId: string): SourceManga => {
	const titles: string[] = [];

	titles.push(decodeHTMLEntity($("a", $(".item-title")).text().trim() ?? ""));
	const altTitles = $(".alias-set").text().trim().split("/");
	for (const title of altTitles) {
		titles.push(decodeHTMLEntity(title));
	}

	const description = decodeHTMLEntity($(".limit-html").text().trim() ?? "");

	const authorElement = $('div.attr-item b:contains("Authors")').next("span");
	const author = authorElement.length
		? authorElement
				.children()
				.map((_: number, e: any) => {
					return $(e).text().trim();
				})
				.toArray()
				.join(", ")
		: "";

	const artistElement = $('div.attr-item b:contains("Artists")').next("span");
	const artist = artistElement.length
		? artistElement
				.children()
				.map((_: number, e: any) => {
					return $(e).text().trim();
				})
				.toArray()
				.join(", ")
		: "";

	const arrayTags: Tag[] = [];
	for (const tag of $('div.attr-item b:contains("Genres")')
		.next("span")
		.children()
		.toArray()) {
		const label = $(tag).text().trim();
		const id = encodeURI(BTGenres.getParam(label) ?? label);

		if (!id || !label) continue;
		arrayTags.push({ id: id, label: label });
	}
	const tagSections: TagSection[] = [
		App.createTagSection({
			id: "0",
			label: "genres",
			tags: arrayTags.map((x) => App.createTag(x)),
		}),
	];

	const rawStatus = $('div.attr-item b:contains("Upload status")')
		.next("span")
		.text()
		.trim();
	let status = "ONGOING";
	switch (rawStatus.toUpperCase()) {
		case "ONGOING":
			status = "Ongoing";
			break;
		case "COMPLETED":
			status = "Completed";
			break;
		case "HIATUS":
			status = "Hiatus";
			break;
		default:
			status = "Ongoing";
			break;
	}

	return App.createSourceManga({
		id: mangaId,
		mangaInfo: App.createMangaInfo({
			titles: titles,
			image: `mangaId=${mangaId}`,
			status: status,
			author: author,
			artist: artist,
			tags: tagSections,
			desc: description,
		}),
	});
};

export const parseChapterList = ($: any, mangaId: string): Chapter[] => {
	const chapters: Chapter[] = [];
	let sortingIndex = 0;

	for (const chapter of $("div.episode-list div.main .item").toArray()) {
		const title = $("b", chapter).text().trim();
		const chapterId: string =
			$("a", chapter)
				.attr("href")
				?.replace(/\/$/, "")
				?.split("/")
				.pop() ?? "";
		const group: string = $("a.ps-3 > span", chapter).text().trim();
		if (!chapterId) continue;

		let language = BTLanguages.getLangCode($("em").attr("data-lang") ?? "");
		if (language === "Unknown") language = "🇬🇧";

		const timeAgo = $("i.ps-3", chapter).text().trim().split(" ");
		let date = new Date(Date.now());
		if (timeAgo[1] == "secs")
			date = new Date(Date.now() - 1000 * Number(timeAgo[0]));
		if (timeAgo[1] == "mins")
			date = new Date(Date.now() - 1000 * 60 * Number(timeAgo[0]));
		if (timeAgo[1] == "hours")
			date = new Date(Date.now() - 1000 * 3600 * Number(timeAgo[0]));
		if (timeAgo[1] == "days")
			date = new Date(Date.now() - 1000 * 3600 * 24 * Number(timeAgo[0]));

		let chapNum: number = 0;
		let volumeNum: number = 0;

		// Extract volume number
		const volumeNumRegex = title.match(
			/(?:volume|vol|v)[\s.:]*#?(\d+(?:\.\d+)?)/i
		);

		if (volumeNumRegex && volumeNumRegex[1]) {
			volumeNum = Number(volumeNumRegex[1]);
		}

		// Extract chapter number
		const chapNumRegex = title.match(
			/(?:chapter|chap|ch|c)[\s.:]*#?(\d+(?:\.\d+)?)/i
		);

		if (chapNumRegex && chapNumRegex[1]) {
			chapNum = Number(chapNumRegex[1]);
		} else {
			// Find all numbers (including decimals) in the title
			const numberRegex = /\b\d+(?:\.\d+)?\b/g;
			const numbers: Array<{
				index: number;
				value: string;
				type: "volume" | "chapter" | "unknown";
			}> = [];
			let match: RegExpExecArray | null;

			while ((match = numberRegex.exec(title))) {
				const num = match[0];
				const index = match.index;

				// Get the substring before the number
				const beforeNumber = title
					.substring(0, index)
					.toLowerCase()
					.trim();

				// Get the last word before the number
				const words = beforeNumber.split(/\s+/);
				const lastWord = words[words.length - 1];

				if (/^(volume|vol|v)$/i.test(lastWord)) {
					// This is a volume number
					volumeNum = Number(num);
				} else if (/^(chapter|chap|ch|c)$/i.test(lastWord)) {
					// This is a chapter number
					chapNum = Number(num);
				} else {
					// Could be either, store for later
					numbers.push({ index, value: num, type: "unknown" });
				}
			}

			// If we still don't have a chapter number, use the last number not identified as volume
			if (chapNum === 0 && numbers.length > 0) {
				// Exclude any number that matches the extracted volume number
				const possibleChapNumbers = numbers.filter(
					(n) => Number(n.value) !== volumeNum
				);

				if (possibleChapNumbers.length > 0) {
					const lastNumber =
						possibleChapNumbers[possibleChapNumbers.length - 1]!
							.value;
					chapNum = Number(lastNumber);
				}
			}
		}

		if (isNaN(chapNum)) chapNum = 0;
		if (isNaN(volumeNum)) volumeNum = 0;

		chapters.push({
			id: chapterId,
			name: title,
			langCode: language,
			chapNum: chapNum,
			time: date,
			sortingIndex,
			volume: volumeNum,
			group: group,
		});
		sortingIndex--;
	}

	if (chapters.length == 0) {
		throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`);
	}

	return chapters.map((chapter) => {
		chapter.sortingIndex += chapters.length;
		return App.createChapter(chapter);
	});
};

export const parseChapterDetails = (
	$: any,
	mangaId: string,
	chapterId: string
): ChapterDetails => {
	// Get all of the pages
	const scriptObj = $("script")
		.toArray()
		.find((obj: any) => {
			const data = obj.children[0]?.data ?? "";
			return data.includes("batoPass") && data.includes("batoWord");
		});
	const script = scriptObj?.children[0]?.data ?? "";

	const batoPass = eval(
		script.match(/const\s+batoPass\s*=\s*(.*?);/)?.[1] ?? ""
	).toString();
	const batoWord = script.match(/const\s+batoWord\s*=\s*"(.*)";/)?.[1] ?? "";
	const imgHttps = script.match(/const\s+imgHttps\s*=\s*(.*?);/)?.[1] ?? "";

	const imgList: string[] = JSON.parse(imgHttps);
	const tknList: string[] = JSON.parse(
		CryptoJS.AES.decrypt(batoWord, batoPass).toString(CryptoJS.enc.Utf8)
	);

	const pages = imgList.map(
		(value: string, index: number) => `${value}?${tknList[index]}`
	);

	const chapterDetails = App.createChapterDetails({
		id: chapterId,
		mangaId: mangaId,
		pages: pages,
	});
	return chapterDetails;
};

export const parseHomeSections = (
	$: any,
	sectionCallback: (section: HomeSection) => void
): void => {
	const popularSection = App.createHomeSection({
		id: "popular_updates",
		title: "Popular Updates",
		containsMoreItems: true,
		type: HomeSectionType.singleRowLarge,
	});

	const latestSection = App.createHomeSection({
		id: "latest_releases",
		title: "Latest Releases",
		containsMoreItems: true,
		type: HomeSectionType.singleRowNormal,
	});

	// Popular Updates
	const popularSection_Array: PartialSourceManga[] = [];
	for (const manga of $(".home-popular .col.item").toArray()) {
		const image: string = $("img", manga).first().attr("src") ?? "";
		const title: string = $(".item-title", manga).text().trim() ?? "";
		const id =
			$("a", manga)
				.attr("href")
				?.replace("/series/", "")
				?.trim()
				.split("/")[0] ?? "";
		const btcode = $("em", manga).attr("data-lang");
		const lang: string = btcode ? BTLanguages.getLangCode(btcode) : "🇬🇧";
		const subtitle: string =
			lang + " " + $(".item-volch", manga).text().trim();

		if (!id || !title) continue;
		popularSection_Array.push(
			App.createPartialSourceManga({
				image: image,
				title: decodeHTMLEntity(title),
				mangaId: id,
				subtitle: decodeHTMLEntity(subtitle),
			})
		);
	}
	popularSection.items = popularSection_Array;
	sectionCallback(popularSection);

	// Latest Releases
	const latestSection_Array: PartialSourceManga[] = [];
	for (const manga of $(".series-list .col.item").toArray()) {
		const image: string = $("img", manga).attr("src") ?? "";
		const title: string = $(".item-title", manga).text().trim() ?? "";
		const id =
			$("a", manga)
				.attr("href")
				?.replace("/series/", "")
				?.trim()
				.split("/")[0] ?? "";
		const btcode = $("em", manga).attr("data-lang");
		const lang: string = btcode ? BTLanguages.getLangCode(btcode) : "🇬🇧";
		const subtitle: string =
			lang + " " + $(".item-volch a", manga).text().trim();

		if (!id || !title) continue;
		latestSection_Array.push(
			App.createPartialSourceManga({
				image: image,
				title: decodeHTMLEntity(title),
				mangaId: id,
				subtitle: decodeHTMLEntity(subtitle),
			})
		);
	}
	latestSection.items = latestSection_Array;
	sectionCallback(latestSection);
};

export const parseViewMore = ($: any): PartialSourceManga[] => {
	const manga: PartialSourceManga[] = [];
	const collectedIds: string[] = [];

	for (const obj of $(".item", "#series-list").toArray()) {
		const id =
			$("a", obj)
				.attr("href")
				?.replace("/series/", "")
				.trim()
				.split("/")[0] ?? "";
		const title = $(".item-title", obj).text();
		const btcode = $("em", obj).attr("data-lang");
		const lang: string = btcode ? BTLanguages.getLangCode(btcode) : "🇬🇧";
		const subtitle = lang + " " + $(".visited", obj).text().trim();
		const image = $("img", obj).attr("src") ?? "";

		if (!id || !title || collectedIds.includes(id)) continue;
		manga.push(
			App.createPartialSourceManga({
				image: image,
				title: decodeHTMLEntity(title),
				mangaId: id,
				subtitle: decodeHTMLEntity(subtitle),
			})
		);
		collectedIds.push(id);
	}

	return manga;
};

export const parseTags = (): TagSection[] => {
	const arrayTags: Tag[] = [];
	for (const label of BTGenres.getGenresList()) {
		const id = encodeURI(BTGenres.getParam(label) ?? label);

		if (!id || !label) continue;
		arrayTags.push({ id: id, label: label });
	}
	const tagSections: TagSection[] = [
		App.createTagSection({
			id: "0",
			label: "genres",
			tags: arrayTags.map((x) => App.createTag(x)),
		}),
	];
	return tagSections;
};

export const parseSearch = (
	$: any,
	langFilter: boolean,
	langs: string[],
	query?: SearchRequest
): PartialSourceManga[] => {
	const mangas: { manga: PartialSourceManga; relevance: number }[] = [];
	for (const obj of $(".item", "#series-list").toArray()) {
		const id =
			$(".item-cover", obj)
				.attr("href")
				?.replace("/series/", "")
				?.trim()
				.split("/")[0] ?? "";
		const title: string = $(".item-title", obj).text() ?? "";
		const btcode = $("em", obj).attr("data-lang") ?? "en,en_us";
		const lang: string = btcode ? BTLanguages.getLangCode(btcode) : "🇬🇧";
		const subtitle = lang + " " + $(".visited", obj).text().trim();
		const image = $("img", obj).attr("src") ?? "";

		if (!id || !title) continue;
		if (langFilter && !langs.includes(btcode)) continue;

		const partialManga = App.createPartialSourceManga({
			image: image,
			title: decodeHTMLEntity(title),
			mangaId: id,
			subtitle: subtitle,
		});

		let relevance = 0;
		if (query?.title) {
			relevance = relevanceScore(title, query.title);
		}

		mangas.push({
			manga: partialManga,
			relevance: relevance,
		});
	}
	mangas.sort((a, b) => b.relevance - a.relevance);
	return mangas.map((r) => r.manga);
};

export const parseThumbnailUrl = ($: any): string => {
	return $("div.attr-cover img").attr("src") ?? "";
};

export const isLastPage = ($: any): boolean => {
	return $(".page-item").last().hasClass("disabled");
};
