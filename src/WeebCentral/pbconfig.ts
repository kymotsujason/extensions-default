import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "Weebcentral",
	version: "0.9.1",
	description: "The weebcentral.com extension.",
	contentRating: ContentRating.EVERYONE,
	developers: [
		{
			name: "Gabe",
			website: "http://github.com/GabrielCWT",
		},
	],
	badges: [],
	capabilities: [
		SourceIntents.MANGA_CHAPTERS,
		SourceIntents.HOMEPAGE_SECTIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
		SourceIntents.SETTINGS_UI,
	],
};
