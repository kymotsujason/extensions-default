import {
	DUIButton,
	DUINavigationButton,
	RequestManager,
	SecureStateManager,
	SourceStateManager,
} from "@paperback/types/lib/compat/0.8";
import { BTLanguages } from "./BatoToHelper";

const getLanguages = async (
	stateManager: SourceStateManager
): Promise<string[]> => {
	return (
		(await stateManager.retrieve("languages")) ?? BTLanguages.getDefault()
	);
};

const getLanguageHomeFilter = async (
	stateManager: SourceStateManager
): Promise<boolean> => {
	return (await stateManager.retrieve("language_home_filter")) ?? false;
};

const getLanguageSearchFilter = async (
	stateManager: SourceStateManager
): Promise<boolean> => {
	return (await stateManager.retrieve("language_search_filter")) ?? false;
};

const getProxyUser = async (
	stateManager: SourceStateManager
): Promise<string> => {
	return (await stateManager.retrieve("proxy_user")) ?? "";
};

const getProxyPass = async (
	stateManager: SecureStateManager
): Promise<string> => {
	return (await stateManager.retrieve("proxy_pass")) ?? "";
};

export const getProxyAccess = async (
	stateManager: SecureStateManager
): Promise<string> => {
	return (await stateManager.retrieve("proxy_token")) ?? "";
};

export const getProxyServer = async (
	stateManager: SourceStateManager
): Promise<string> => {
	return (await stateManager.retrieve("proxy_server")) ?? "";
};

export const getEnableProxyServer = async (
	stateManager: SourceStateManager
): Promise<boolean> => {
	return (await stateManager.retrieve("enable_proxy_server")) ?? false;
};

export const proxySettings = (
	stateManager: SourceStateManager,
	requestManager: RequestManager
): DUINavigationButton => {
	return App.createDUINavigationButton({
		id: "proxy_settings",
		label: "Proxy Settings",
		form: App.createDUIForm({
			sections: async () => [
				App.createDUISection({
					id: "proxy",
					footer: "Proxy Settings",
					isHidden: false,
					rows: async () => [
						App.createDUIInputField({
							id: "proxy_server",
							label: "Proxy Server",
							value: App.createDUIBinding({
								get: () => getProxyServer(stateManager),
								set: async (newValue) =>
									await stateManager.store(
										"proxy_server",
										newValue
									),
							}),
						}),
						App.createDUIInputField({
							id: "proxy_user",
							label: "Proxy Username",
							value: App.createDUIBinding({
								get: () => getProxyUser(stateManager),
								set: async (newValue) =>
									await stateManager.store(
										"proxy_user",
										newValue
									),
							}),
						}),
						App.createDUIInputField({
							id: "proxy_pass",
							label: "Proxy Password",
							value: App.createDUIBinding({
								get: () => getProxyPass(stateManager),
								set: async (newValue) =>
									await stateManager.store(
										"proxy_pass",
										newValue
									),
							}),
						}),
						App.createDUISwitch({
							id: "enable_proxy_server",
							label: "Enable Proxy Server",
							value: App.createDUIBinding({
								get: () => getEnableProxyServer(stateManager),
								set: async (newValue) =>
									await stateManager.store(
										"enable_proxy_server",
										newValue
									),
							}),
						}),
						App.createDUIButton({
							id: "test_proxy",
							label: "Test Proxy Server",
							onTap: async () => {
								const proxyURL = await getProxyServer(
									stateManager
								);
								const request = App.createRequest({
									url: `${proxyURL}`,
									method: "GET",
									headers: {
										referer: `${proxyURL}/`,
									},
								});

								const response = await requestManager.schedule(
									request,
									1
								);
								throw new Error(`${response.status}`);
							},
						}),
						App.createDUIButton({
							id: "login_proxy_server",
							label: "Login to Proxy Server",
							onTap: async () => {
								const proxyURL = await getProxyServer(
									stateManager
								);
								const username = await getProxyUser(
									stateManager
								);
								const password = await getProxyPass(
									stateManager
								);
								const request = App.createRequest({
									url: `${proxyURL}/api/auth/login`,
									method: "POST",
									headers: {
										"Content-Type": "application/json",
										referer: `${proxyURL}/`,
									},
									param: `?username=${username}&password=${password}`,
								});

								const response = await requestManager.schedule(
									request,
									1
								);

								const json = JSON.parse(
									response.data as string
								);
								if (response.status === 200) {
									await stateManager.store(
										"proxy_token",
										json.token
									);
									throw new Error(
										`Done Login: ${json.token}`
									);
								} else {
									throw new Error(
										`Login failed with error code: ${JSON.stringify(
											json
										)}`
									);
								}
							},
						}),
					],
				}),
			],
		}),
	});
};

export const languageSettings = (
	stateManager: SourceStateManager
): DUINavigationButton => {
	return App.createDUINavigationButton({
		id: "language_settings",
		label: "Language Settings",
		form: App.createDUIForm({
			sections: async () => [
				App.createDUISection({
					id: "content",
					footer: "When enabled, mangas will be filtered by the selected languages.",
					isHidden: false,
					rows: async () => [
						App.createDUISelect({
							id: "languages",
							label: "Languages",
							options: BTLanguages.getBTCodeList(),
							labelResolver: async (option) =>
								BTLanguages.getName(option),
							value: App.createDUIBinding({
								get: () => getLanguages(stateManager),
								set: async (newValue) =>
									await stateManager.store(
										"languages",
										newValue
									),
							}),
							allowsMultiselect: true,
						}),
						App.createDUISwitch({
							id: "language_home_filter",
							label: "Filter Homepage Language",
							value: App.createDUIBinding({
								get: () => getLanguageHomeFilter(stateManager),
								set: async (newValue) =>
									await stateManager.store(
										"language_home_filter",
										newValue
									),
							}),
						}),
						App.createDUISwitch({
							id: "language_search_filter",
							label: "Filter Search Language",
							value: App.createDUIBinding({
								get: () =>
									getLanguageSearchFilter(stateManager),
								set: async (newValue) =>
									await stateManager.store(
										"language_search_filter",
										newValue
									),
							}),
						}),
					],
				}),
			],
		}),
	});
};

export const resetSettings = (stateManager: SourceStateManager): DUIButton => {
	return App.createDUIButton({
		id: "reset",
		label: "Reset to Default",
		onTap: async () => {
			await Promise.all([
				stateManager.store("languages", BTLanguages.getDefault()),
				stateManager.store("language_home_filter", false),
				stateManager.store("language_search_filter", false),
			]);
		},
	});
};
