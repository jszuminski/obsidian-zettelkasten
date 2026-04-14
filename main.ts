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
  private registeredCommandIds = new Set<string>();

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: 'set-current-literature-note',
      name: 'Set currently reading literature note',
      callback: () => setCurrentlyReading(this),
    });

    this.addCreateNotesCommands();

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

    // in case the user added a new note type, we need to add this command
    this.addCreateNotesCommands();
  }

  private addCreateNotesCommands() {
    for (let i = 0; i < this.settingsSerialized.noteTypes.length; i++) {
      const noteType = this.settingsSerialized.noteTypes[i];
      const id = `create-note-type-${i}`;
      if (this.registeredCommandIds.has(id)) continue;
      this.registeredCommandIds.add(id);
      this.addCommand({
        id,
        name: `New [${noteType.name}]`,
        callback: () => createNote(this, noteType),
      });
    }
  }
}
