import { IPluginSettings } from './settings.types';

export const DEFAULT_SETTINGS: IPluginSettings = {
  // ex. "1080. Note title"
  idSeparator: '.',

  literatureNotesFolderPath: null,
  currentlyReadingNotePath: null,

  // ex. "Atoms", "Molecules", "Literature"
  noteTypes: [],
};
