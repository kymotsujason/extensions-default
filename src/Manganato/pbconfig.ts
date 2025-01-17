import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "Manganato",
	version: "0.9.1",
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
		SourceIntents.HOMEPAGE_SECTIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.SETTINGS_UI,
	],
};
