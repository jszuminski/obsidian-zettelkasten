import { CurrentlyReadingLiteratureNote } from "src/currentlyReading/types";

export type IPluginSettings = {
	literatureNotesLocation: string;
	currentlyReading: CurrentlyReadingLiteratureNote | null;
};
