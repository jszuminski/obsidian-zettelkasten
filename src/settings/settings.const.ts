import { IPluginSettings } from "./settings.types";

export const DEFAULT_SETTINGS: IPluginSettings = {
	literatureNotesLocation: "",
	currentlyReading: null,

	// related to note creation
	noteTemplatePath: "",
	notesLocation: "",

	// ex. "1080. Note title"
	idSeparator: ".",
};
