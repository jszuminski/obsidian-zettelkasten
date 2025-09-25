import { TFile } from "obsidian";

export type IPluginSettings = {
	literatureNotesLocation: string; // @todo change to TFolder
	currentlyReading: TFile | null;

	// related to note creation
	noteTemplatePath: string; // @todo change to TFile
	notesLocation: string; // @todo change to TFolder

	idSeparator: string;
};
