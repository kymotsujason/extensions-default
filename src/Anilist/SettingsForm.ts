import {
	Form,
	Section,
	OAuthButtonRow,
	NavigationRow,
	LabelRow,
	ButtonRow,
	DeferredItem,
} from "@paperback/types";
import { AccessToken } from "./main";
import * as AnilistUser from "./anilist-user";
import { MakeRequestFunction } from "./SourceForm";

export class SettingsForm extends Form {
	private saveAccessToken: (
		accessToken: string | undefined
	) => AccessToken | undefined;
	private refreshUserInfo: () => Promise<void>;
	private getAccessToken: () => AccessToken | undefined;
	private getUserInfo: () => AnilistUser.Viewer | undefined;
	private parseAccessToken: (
		accessToken: string | undefined
	) => any | undefined;
	private makeRequest: MakeRequestFunction;

	constructor(
		saveAccessToken: (
			accessToken: string | undefined
		) => AccessToken | undefined,
		refreshUserInfo: () => Promise<void>,
		getAccessToken: () => AccessToken | undefined,
		getUserInfo: () => AnilistUser.Viewer | undefined,
		parseAccessToken: (accessToken: string | undefined) => any | undefined,
		makeRequest: MakeRequestFunction
	) {
		super();
		this.saveAccessToken = saveAccessToken;
		this.refreshUserInfo = refreshUserInfo;
		this.getAccessToken = getAccessToken;
		this.getUserInfo = getUserInfo;
		this.parseAccessToken = parseAccessToken;
		this.makeRequest = makeRequest;
	}

	override getSections(): Application.FormSectionElement[] {
		return [
			Section("oAuthSection", [
				DeferredItem(() => {
					if (this.getAccessToken()) {
						return NavigationRow("sessionInfo", {
							title: "Session Info",
							form: new (class extends Form {
								private saveAccessToken: (
									accessToken: string | undefined
								) => AccessToken | undefined;
								private refreshUserInfo: () => Promise<void>;
								private getAccessToken: () =>
									| AccessToken
									| undefined;
								private getUserInfo: () =>
									| AnilistUser.Viewer
									| undefined;
								private parseAccessToken: (
									accessToken: string | undefined
								) => any | undefined;
								private makeRequest: MakeRequestFunction;

								constructor(
									saveAccessToken: (
										accessToken: string | undefined
									) => AccessToken | undefined,
									refreshUserInfo: () => Promise<void>,
									getAccessToken: () =>
										| AccessToken
										| undefined,
									getUserInfo: () =>
										| AnilistUser.Viewer
										| undefined,
									parseAccessToken: (
										accessToken: string | undefined
									) => any | undefined,
									makeRequest: MakeRequestFunction
								) {
									super();
									this.saveAccessToken = saveAccessToken;
									this.refreshUserInfo = refreshUserInfo;
									this.getAccessToken = getAccessToken;
									this.getUserInfo = getUserInfo;
									this.parseAccessToken = parseAccessToken;
									this.makeRequest = makeRequest;
								}

								override getSections(): Application.FormSectionElement[] {
									const accessToken = this.getAccessToken();
									const userInfo = this.getUserInfo();
									if (!accessToken)
										return [
											Section("introspect", [
												LabelRow("logged_out", {
													title: "LOGGED OUT",
												}),
											]),
										];

									return [
										Section(
											"introspect",
											Object.keys(
												accessToken.tokenBody
											).map((key) => {
												return LabelRow(key, {
													title: key,
													value: `${accessToken.tokenBody[key]}`,
												});
											})
										),
										Section("userinfo", [
											LabelRow("id", {
												title: "ID",
												value: `${userInfo?.id}`,
											}),
											LabelRow("name", {
												title: "Name",
												value: `${userInfo?.name}`,
											}),
										]),
										Section("logout", [
											ButtonRow("refresh", {
												title: "Refresh User Info",
												onSelect: Application.Selector(
													this,
													// @ts-expect-error
													"refresh"
												),
											}),
											ButtonRow("logout", {
												title: "Logout",
												onSelect: Application.Selector(
													this,
													// @ts-expect-error
													"logout"
												),
											}),
										]),
									];
								}

								async refresh(): Promise<void> {
									await this.refreshUserInfo();
									this.reloadForm();
								}

								async logout(): Promise<void> {
									this.saveAccessToken(undefined);
									this.reloadForm();
								}
							})(
								this.saveAccessToken,
								this.refreshUserInfo,
								this.getAccessToken,
								this.getUserInfo,
								this.parseAccessToken,
								this.makeRequest
							),
						});
					} else {
						return OAuthButtonRow("oAuthButton", {
							title: "Login with Anilist",
							authorizeEndpoint:
								"https://anilist.co/api/v2/oauth/authorize",
							clientId: "5459",
							responseType: {
								type: "token",
							},
							onSuccess: Application.Selector(
								this as SettingsForm,
								"oauthDidSucceed"
							),
						});
					}
				}),
			]),
		];
	}

	async oauthDidSucceed(value: string) {
		this.saveAccessToken(value);
	}
}
