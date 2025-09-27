import { TFolder, TFile } from 'obsidian';

/**
 * We cannot store TFile's as settings. We can only store primitives.
 * Thus, let's store paths as strings and create a helper which will deal
 * with transforming those locations & paths to TFile/TFolder.
 */
export type IPluginSettings = {
  literatureNotesFolderPath: string | null;
  currentlyReadingNotePath: string | null;

  // related to note creation
  noteTemplatePath: string | null;
  notesLocation: string | null;

  idSeparator: string;
};

export type IPluginSettingsSerialized = {
  literatureNotesFolder: TFolder | null;
  currentlyReadingNote: TFile | null;

  notesFolder: TFolder | null;
  noteTemplate: TFile | null;

  idSeparator: string;
};
