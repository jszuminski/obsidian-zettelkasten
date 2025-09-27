import { App, Plugin } from 'obsidian';
import {
  IPluginSettings,
  IPluginSettingsSerialized,
} from './settings/settings.types';

export interface IPluginType extends Plugin {
  app: App;
  settings: IPluginSettings;
  settingsSerialized: IPluginSettingsSerialized;
  saveSettings(): Promise<void>;
  loadSettings(): Promise<void>;
}
