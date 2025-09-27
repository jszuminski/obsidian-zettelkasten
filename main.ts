import { Plugin } from 'obsidian';
import { setCurrentlyReading } from 'src/currentlyReading/setCurrentlyReading';
import { DEFAULT_SETTINGS } from 'src/settings/settings.const';
import {
  IPluginSettings,
  IPluginSettingsSerialized,
} from 'src/settings/settings.types';
import { createNote } from 'src/createNote/createNote';
import { SettingsTab } from 'src/settings/SettingsTab.class';
import { serializeSettings } from 'src/settings/serializeSettings';

export default class IPlugin extends Plugin {
  settings: IPluginSettings;
  settingsSerialized: IPluginSettingsSerialized;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: 'set-current-literature-note',
      name: 'Set currently reading Literature Note',
      callback: () => setCurrentlyReading(this),
    });

    this.addCommand({
      id: 'create-note',
      name: 'Create Note',
      callback: () => createNote(this),
    });

    this.addSettingTab(new SettingsTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.settingsSerialized = serializeSettings(this.app, this.settings);
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.settingsSerialized = serializeSettings(this.app, this.settings);
  }
}
