import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "BatoTo",
	version: "1.0.0",
	description: "The batocomic.org extension.",
	contentRating: ContentRating.MATURE,
	developers: [
		{
			name: "Paperback Community",
			website: "https://github.com/paperback-community",
		},
	],
	badges: [],
	capabilities: [
		SourceIntents.MANGA_CHAPTERS,
		SourceIntents.DISCOVER_SECIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.SETTINGS_UI,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
	],
};
