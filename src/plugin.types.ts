import { App } from "obsidian";
import { IPluginSettings } from "./settings/settings.types";

export type IPluginType = {
	app: App;
	settings: IPluginSettings;
	saveSettings(): Promise<void>;
	loadSettings(): Promise<void>;
};
