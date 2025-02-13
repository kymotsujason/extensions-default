import { ContentRating, SourceIntents } from "@paperback/types";

export default {
	icon: "icon.png",
	name: "Weebcentral",
	version: "1.0.0",
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
		SourceIntents.DISCOVER_SECIONS,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
		SourceIntents.SETTINGS_UI,
	],
};
