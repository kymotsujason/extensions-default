import { ContentRating, SourceInfo, SourceIntents } from "@paperback/types";

export default {
	name: "Anilist",
	description: "The anilist.co tracker extension.",
	version: "2.0.0",
	icon: "icon.png",
	language: "en",
	contentRating: ContentRating.EVERYONE,
	badges: [
		{ label: "Tracker", textColor: "#FFFFFF", backgroundColor: "#005ff9" },
	],
	capabilities: [
		SourceIntents.SETTINGS_UI,
		SourceIntents.MANGA_SEARCH,
		SourceIntents.MANGA_TRACKING,
		SourceIntents.HOMEPAGE_SECTIONS,
	],
	developers: [
		{
			name: "Celarye",
			website: "https://celarye.dev",
			github: "https://github.com/Celarye",
		},
	],
} as SourceInfo;
