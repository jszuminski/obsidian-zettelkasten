import { App, TFile, TFolder } from 'obsidian';
import { IPluginSettings, IPluginSettingsSerialized } from './settings.types';

export const serializeSettings = (
  app: App,
  settings: IPluginSettings
): IPluginSettingsSerialized => {
  const getFolder = (path: string | null): TFolder | null => {
    if (!path) {
      return null;
    }

    const f = app.vault.getAbstractFileByPath(path);
    return f instanceof TFolder ? f : null;
  };

  const getFile = (path: string | null): TFile | null => {
    if (!path) {
      return null;
    }

    const f = app.vault.getAbstractFileByPath(path);
    return f instanceof TFile ? f : null;
  };

  return {
    idSeparator: settings.idSeparator,
    literatureNotesFolder: getFolder(settings.literatureNotesFolderPath),
    currentlyReadingNote: getFile(settings.currentlyReadingNotePath),
    noteTypes: settings.noteTypes.map((note) => ({
      name: note.name,
      template: getFile(note.templatePath),
      location: getFolder(note.locationPath),
    })),
  };
};
