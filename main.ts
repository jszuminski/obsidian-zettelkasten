import { Notice, Plugin } from "obsidian";
import { setCurrentlyReading } from "src/currentlyReading/setCurrentlyReading";
import { DEFAULT_SETTINGS } from "src/settings/settings.const";
import { IPluginSettings } from "src/settings/settings.types";
import { createNote } from "src/createNote/createNote";
import { SettingsTab } from "src/settings/SettingsTab.class";

export default class IPlugin extends Plugin {
	settings: IPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		this.addCommand({
			id: "set-current-literature-note",
			name: "Set currently reading Literature Note",
			callback: () => setCurrentlyReading(this.app, this),
		});

		this.addCommand({
			id: "create-note",
			name: "Create Note",
			callback: () => createNote(this.app, this),
		});

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
