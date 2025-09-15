import { App, Plugin } from "obsidian";
import { IPluginSettings } from "./settings/settings.types";

export interface IPluginType extends Plugin {
	app: App;
	settings: IPluginSettings;
	saveSettings(): Promise<void>;
	loadSettings(): Promise<void>;
}
