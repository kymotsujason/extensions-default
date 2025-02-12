import {
	ButtonRow,
	Form,
	InputRow,
	LabelRow,
	NavigationRow,
	Section,
	ToggleRow,
} from "@paperback/types";

function getProxyUser(): string {
	return (Application.getState("proxy_user") as string) ?? "";
}

function getProxyPass(): string {
	return (Application.getSecureState("proxy_pass") as string) ?? "";
}

export function getProxyAccess(): string {
	return (Application.getSecureState("proxy_token") as string) ?? "";
}

export function getProxyServer(): string {
	return (Application.getState("proxy_server") as string) ?? "";
}

export function getEnableProxyServer(): boolean {
	return (Application.getState("enable_proxy_server") as boolean) ?? false;
}

function setProxyUser(value: string): void {
	Application.setState(value, "proxy_user");
}

function setProxyPass(value: string): void {
	Application.setSecureState(value, "proxy_pass");
}

function setProxyAccess(value: string): void {
	Application.setSecureState(value, "proxy_token");
}

function setProxyServer(value: string): void {
	Application.setState(value, "proxy_server");
}

function setEnableProxyServer(value: boolean): void {
	Application.setState(value, "enable_proxy_server");
}

export class WeebCentralSettingsForm extends Form {
	override getSections(): Application.FormSectionElement[] {
		return [
			Section("proxy", [
				NavigationRow("proxy", {
					title: "Proxy Settings",
					form: new (class extends Form {
						override getSections(): Application.FormSectionElement[] {
							return [
								Section("proxySection", [
									LabelRow("proxyInfo", {
										title: "Prehash the password with an online bcrypter",
									}),
									InputRow("proxyinput", {
										title: "Proxy Server",
										value:
											getProxyServer() != ""
												? getProxyServer()
												: "",
										onValueChange: Application.Selector(
											this,
											// @ts-expect-error
											"changeProxy"
										),
									}),
									InputRow("userinput", {
										title: "Proxy Username",
										value:
											getProxyUser() != ""
												? getProxyUser()
												: "",
										onValueChange: Application.Selector(
											this,
											// @ts-expect-error
											"changeProxyUser"
										),
									}),
									InputRow("passinput", {
										title: "Proxy Password",
										value:
											getProxyPass() != ""
												? getProxyPass()
												: "",
										onValueChange: Application.Selector(
											this,
											// @ts-expect-error
											"changeProxyPass"
										),
									}),
									ToggleRow("enableProxy", {
										title: "Enable Proxy Server",
										value: getEnableProxyServer(),
										onValueChange: Application.Selector(
											this,
											// @ts-expect-error
											"changeEnableProxy"
										),
									}),
									ButtonRow("testProxy", {
										title: "Test Proxy",
										onSelect: Application.Selector(
											this,
											// @ts-expect-error
											"testProxy"
										),
									}),
									ButtonRow("login", {
										title: "Login to Proxy",
										onSelect: Application.Selector(
											this,
											// @ts-expect-error
											"login"
										),
									}),
								]),
							];
						}

						async changeProxy(value: string): Promise<void> {
							setProxyServer(value);
						}

						async changeProxyUser(value: string): Promise<void> {
							setProxyUser(value);
						}

						async changeProxyPass(value: string): Promise<void> {
							setProxyPass(value);
						}

						async changeEnableProxy(value: boolean): Promise<void> {
							setEnableProxyServer(value);
						}

						async testProxy(): Promise<void> {
							const proxyURL = getProxyServer();
							const [response, _] =
								await Application.scheduleRequest({
									method: "GET",
									url: `${proxyURL}`,
									headers: {
										"Content-Type": "application/json",
										referer: `${proxyURL}/`,
									},
								});

							throw new Error(`${response.status}`);
						}

						async login(): Promise<void> {
							const proxyURL = getProxyServer();
							const username = getProxyUser();
							const password = getProxyPass();
							const [response, buffer] =
								await Application.scheduleRequest({
									method: "POST",
									url: `${proxyURL}/api/auth/login`,
									headers: {
										"Content-Type": "application/json",
										referer: `${proxyURL}/`,
									},
									body: {
										username: username,
										password: password,
									},
								});

							const data =
								Application.arrayBufferToUTF8String(buffer);
							const json = JSON.parse(data);
							if (response.status === 200) {
								setProxyAccess(json.token);
								throw new Error(`Done Login: ${json.token}`);
							} else {
								throw new Error(
									`Login failed with error code: ${JSON.stringify(
										json
									)}`
								);
							}
						}
					})(),
				}),
			]),
		];
	}
}
