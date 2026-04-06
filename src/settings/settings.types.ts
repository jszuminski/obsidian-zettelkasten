import { TFolder, TFile } from 'obsidian';

export type IPluginNoteSettings = {
  name: string; // ex. "Daily", "Atom", "Molecule", "Literature"
  templatePath: string | null;
  locationPath: string | null; // where to put all the notes of this type
};

export type IPluginNoteSettingsSerialized = {
  name: string;
  template: TFile | null;
  location: TFolder | null;
};

/**
 * We cannot store TFile's as settings. We can only store primitives.
 * Thus, let's store paths as strings and create a helper which will deal
 * with transforming those locations & paths to TFile/TFolder.
 */
export type IPluginSettings = {
  idSeparator: string; // ex. "." for "1024. Note name"

  literatureNotesFolderPath: string | null;
  currentlyReadingNotePath: string | null;

  noteTypes: IPluginNoteSettings[];
};

export type IPluginSettingsSerialized = {
  idSeparator: string;

  literatureNotesFolder: TFolder | null;
  currentlyReadingNote: TFile | null;

  noteTypes: IPluginNoteSettingsSerialized[];
};
