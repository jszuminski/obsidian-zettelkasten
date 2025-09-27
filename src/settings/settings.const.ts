import { IPluginSettings } from './settings.types';

export const DEFAULT_SETTINGS: IPluginSettings = {
  literatureNotesFolderPath: null,
  currentlyReadingNotePath: null,

  // related to note creation
  noteTemplatePath: null,
  notesLocation: null,

  // ex. "1080. Note title"
  idSeparator: '.',
};
