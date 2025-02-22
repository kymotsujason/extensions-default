import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "Manganato",
	version: "1.0.0",
	description: "The manganato.com extension.",
	contentRating: ContentRating.MATURE,
	developers: [
		{
			name: "Batmeow",
			website: "https://github.com/Batmeow",
		},
	],
	badges: [],
	capabilities: [
		SourceIntents.MANGA_CHAPTERS,
		SourceIntents.DISCOVER_SECIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
	],
};
