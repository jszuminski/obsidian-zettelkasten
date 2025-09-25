import { CurrentlyReadingLiteratureNote } from "src/currentlyReading/types";

export type IPluginSettings = {
	literatureNotesLocation: string;
	currentlyReading: CurrentlyReadingLiteratureNote | null;

	// related to note creation
	noteTemplatePath: string;
	notesLocation: string;

	idSeparator: string;
};
