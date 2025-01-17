import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "BatoTo",
	version: "0.9.1",
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
		SourceIntents.HOMEPAGE_SECTIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.SETTINGS_UI,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
	],
};
