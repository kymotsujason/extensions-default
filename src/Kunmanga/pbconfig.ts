import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "Kun Manga",
	version: "4.0.0",
	description: "The kunmanga.com extension.",
	contentRating: ContentRating.MATURE,
	developers: [
		{
			name: "Netsky",
			website: "http://github.com/TheNetsky",
		},
	],
	badges: [],
	capabilities: [
		SourceIntents.MANGA_CHAPTERS,
		SourceIntents.HOMEPAGE_SECTIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
	],
};
