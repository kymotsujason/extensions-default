import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "King of Shojo",
	version: "0.9.1",
	description: "The kingofshojo.com extension.",
	contentRating: ContentRating.MATURE,
	developers: [
		{
			name: "kymotsujason",
			website: "http://github.com/kymotsujason",
		},
	],
	badges: [],
	capabilities: [
		SourceIntents.MANGA_CHAPTERS,
		SourceIntents.HOMEPAGE_SECTIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.SETTINGS_UI,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
	],
};
