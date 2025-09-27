import { App, TFile, TFolder } from 'obsidian';
import { IPluginSettings, IPluginSettingsSerialized } from './settings.types';

const getFolder = (app: App, path: string | null): TFolder | null => {
  if (!path) {
    return null;
  }

  const f = app.vault.getAbstractFileByPath(path);
  return f instanceof TFolder ? f : null;
};

const getFile = (app: App, path: string | null): TFile | null => {
  if (!path) {
    return null;
  }

  const f = app.vault.getAbstractFileByPath(path);
  return f instanceof TFile ? f : null;
};

export const serializeSettings = (
  app: App,
  settings: IPluginSettings
): IPluginSettingsSerialized => {
  return {
    literatureNotesFolder: getFolder(app, settings.literatureNotesFolderPath),
    currentlyReadingNote: getFile(app, settings.currentlyReadingNotePath),
    notesFolder: getFolder(app, settings.notesLocation),
    noteTemplate: getFile(app, settings.noteTemplatePath),
    idSeparator: settings.idSeparator,
  };
};
