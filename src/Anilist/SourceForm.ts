import {
	DiscoverSection,
	Form,
	InputRow,
	LabelRow,
	Section,
	SelectRow,
	ToggleRow,
} from "@paperback/types";
import * as AnilistManga from "./anilist-manga";
import {
	deleteMangaProgressMutation,
	MangaProgressQuery,
	saveMangaProgressMutation,
	SaveMangaProgressVariables,
} from "./GraphQLQueries";
import * as AnilistUser from "./anilist-user";
import { AccessToken } from "./main";

export interface MakeRequestFunction {
	<QueryVariablesType>(
		query: string,
		QueryVariables?: QueryVariablesType,
		search?: string | DiscoverSection
	): Promise<unknown>;
}

export class SourceForm extends Form {
	private anilistManga: AnilistManga.Media;
	private makeRequest: MakeRequestFunction;
	private getUserInfo: () => AnilistUser.Viewer | undefined;
	private getAccessToken: () => AccessToken | undefined;
	private parseAccessToken: (
		accessToken: string | undefined
	) => any | undefined;

	changes = {
		status: ["CURRENT"],
		privacy: false,
		hideFromStatus: false,
		notes: "",
		chapter: "1",
		volume: "1",
		read: "0",
		rating: "0",
	};
	constructor(
		anilistManga: AnilistManga.Media,
		makeRequest: MakeRequestFunction,
		getUserInfo: () => AnilistUser.Viewer | undefined,
		getAccessToken: () => AccessToken | undefined,
		parseAccessToken: (accessToken: string | undefined) => any | undefined
	) {
		super();

		this.anilistManga = anilistManga;
		this.makeRequest = makeRequest;
		this.getUserInfo = getUserInfo;
		this.getAccessToken = getAccessToken;
		this.parseAccessToken = parseAccessToken;
	}

	override get requiresExplicitSubmission(): boolean {
		return true;
	}

	override getSections(): Application.FormSectionElement[] {
		return [
			Section("User Information", [
				LabelRow("username", {
					title: "Username",
					value: this.getUserInfo()?.name?.toString(),
				}),
			]),
			Section("Manga Information", [
				...(this.anilistManga.mediaListEntry != null
					? [
							LabelRow("id", {
								title: "Entry ID",
								value: this.anilistManga.mediaListEntry?.id?.toString(),
							}),
					  ]
					: []),
				LabelRow("mediaId", {
					title: "Manga ID",
					value: this.anilistManga.id?.toString(),
				}),
				LabelRow("mangaTitle", {
					title: "Title",
					value: this.anilistManga.title?.userPreferred ?? "N/A",
				}),
				LabelRow("mangaPopularity", {
					value: this.anilistManga.popularity?.toString() ?? "N/A",
					title: "Popularity",
				}),
				LabelRow("mangaRating", {
					value: this.anilistManga.averageScore?.toString() ?? "N/A",
					title: "Rating",
				}),
				LabelRow("mangaStatus", {
					value: this.formatStatus(this.anilistManga.status),
					title: "Status",
				}),
				LabelRow("mangaIsAdult", {
					value: this.anilistManga.isAdult ? "Yes" : "No",
					title: "Is Adult",
				}),
			]),
			Section({ id: "mangaNotes", header: "Notes" }, [
				InputRow("notes", {
					title: "Notes",
					value: this.anilistManga.mediaListEntry?.notes ?? "",
					onValueChange: Application.Selector(
						this as SourceForm,
						//@ts-ignore
						"updateNotes"
					),
				}),
			]),
			Section(
				{
					id: "trackStatus",
					header: "Manga Status",
					footer: "Warning: Setting this to NONE will delete the listing from Anilist",
				},
				[
					SelectRow("status", {
						value: this.anilistManga.mediaListEntry?.status
							? [this.anilistManga.mediaListEntry.status]
							: this.changes.status,
						title: "Status",
						onValueChange: Application.Selector(
							this as SourceForm,
							//@ts-ignore
							"statusDidChange"
						),
						minItemCount: 1,
						maxItemCount: 1,
						options: [
							{ id: "NONE", title: "NONE" },
							{
								id: "CURRENT",
								title: "Reading",
							},
							{
								id: "PLANNING",
								title: "Planned",
							},
							{
								id: "COMPLETED",
								title: "Completed",
							},
							{
								id: "DROPPED",
								title: "Dropped",
							},
							{
								id: "PAUSED",
								title: "On-Hold",
							},
							{
								id: "REPEATING",
								title: "Re-Reading",
							},
						],
					}),
				]
			),
			Section({ id: "manage", header: "Progress" }, [
				LabelRow("progresslabel", {
					title: "Chapter",
				}),
				InputRow("progress", {
					title: "Chapter",
					value: (
						this.anilistManga.mediaListEntry?.progress ??
						this.changes.chapter
					).toString(),
					onValueChange: Application.Selector(
						this as SourceForm,
						//@ts-ignore
						"updateChapter"
					),
				}),
				LabelRow("progressVolumeslabel", {
					title: "Volume",
				}),
				InputRow("progressVolumes", {
					title: "Volume",
					value: (
						this.anilistManga.mediaListEntry?.progressVolumes ??
						this.changes.volume
					).toString(),
					onValueChange: Application.Selector(
						this as SourceForm,
						//@ts-ignore
						"updateVolume"
					),
				}),
				LabelRow("repeatlabel", {
					title: "Times Re-Read",
				}),
				InputRow("repeat", {
					title: "Times Re-Read",
					value: (this.anilistManga.mediaListEntry?.repeat !=
					undefined
						? this.anilistManga.mediaListEntry?.repeat
						: this.changes.read
					).toString(),
					onValueChange: Application.Selector(
						this as SourceForm,
						//@ts-ignore
						"updateRead"
					),
				}),
			]),
			Section(
				{
					id: "rateSection",
					header: "Rating",
					footer: "This uses your rating preference set on AniList",
				},
				[
					LabelRow("scorelabel", {
						title: "Score",
					}),
					InputRow("score", {
						title: "Score",
						value: (
							this.anilistManga.mediaListEntry?.score ??
							this.changes.rating
						).toString(),
						onValueChange: Application.Selector(
							this as SourceForm,
							//@ts-ignore
							"updateRating"
						),
					}),
				]
			),
			Section({ id: "privacy_settings", header: "Privacy Settings" }, [
				ToggleRow("private", {
					title: "Private",
					//@ts-ignore
					value:
						this.anilistManga.mediaListEntry?.private != undefined
							? this.anilistManga.mediaListEntry.private
							: false,
					onValueChange: Application.Selector(
						this as SourceForm,
						//@ts-ignore
						"changePrivacy"
					),
				}),
				ToggleRow("hiddenFromStatusLists", {
					title: "Hide From Status List",
					//@ts-ignore
					value:
						this.anilistManga.mediaListEntry
							?.hiddenFromStatusLists != undefined
							? this.anilistManga.mediaListEntry
									.hiddenFromStatusLists
							: false,
					onValueChange: Application.Selector(
						this as SourceForm,
						//@ts-ignore
						"hideFromStatusLists"
					),
				}),
			]),
		];
	}

	async statusDidChange(value: string[]) {
		this.changes.status = value;
	}

	async changePrivacy(value: boolean) {
		this.changes.privacy = value;
	}

	async hideFromStatusLists(value: boolean) {
		this.changes.hideFromStatus = value;
	}

	async updateChapter(value: string) {
		this.changes.chapter = value;
	}

	async updateVolume(value: string) {
		this.changes.volume = value;
	}

	async updateRead(value: string) {
		this.changes.read = value;
	}

	async updateRating(value: string) {
		this.changes.rating = value;
	}

	async updateNotes(value: string) {
		this.changes.notes = value;
	}

	override async formDidSubmit?(): Promise<void> {
		const id = this.anilistManga.mediaListEntry?.id
			? Number(this.anilistManga.mediaListEntry?.id)
			: undefined;
		const mediaId = Number(this.anilistManga.id);

		if (this.changes.status[0] === "NONE" && id != null) {
			let mutation = {
				id: id,
			};
			await this.makeRequest<MangaProgressQuery>(
				deleteMangaProgressMutation,
				mutation
			);
		} else {
			let mutation = {
				id: id,
				mediaId: mediaId,
				status: this.changes.status[0],
				notes: this.changes.notes,
				progress: parseInt(this.changes.chapter),
				progressVolumes: parseInt(this.changes.volume),
				repeat: parseInt(this.changes.read),
				private: this.changes.privacy,
				hiddenFromStatusLists: this.changes.hideFromStatus,
				score: Number(this.changes.rating),
			};
			await this.makeRequest<SaveMangaProgressVariables>(
				saveMangaProgressMutation,
				mutation
			);
		}
	}

	async submit() {}

	formatStatus(value: string | undefined): string {
		switch (value) {
			case "CURRENT":
				return "Reading";
			case "PLANNING":
				return "Planned";
			case "COMPLETED":
				return "Completed";
			case "DROPPED":
				return "Dropped";
			case "PAUSED":
				return "On-Hold";
			case "REPEATING":
				return "Re-Reading";

			case "FINISHED":
				return "Finished";
			case "RELEASING":
				return "Releasing";
			case "NOT_YET_RELEASED":
				return "Not Yet Released";
			case "CANCELLED":
				return "Cancelled";
			case "HIATUS":
				return "Hiatus";

			case "NONE":
				return "None";
			default:
				return "N/A";
		}
	}
}
