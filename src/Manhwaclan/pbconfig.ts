import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "Manhwa Clan",
	version: "0.9.1",
	description: "The manhwaclan.com extension.",
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
		SourceIntents.SETTINGS_UI,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
	],
};
