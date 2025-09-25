import { TFile, TFolder } from "obsidian"

/**
* Lists all files in a given folder recursively.
* Meaning that:
* - /a/b/c/note.md
* will be included even if folder = 'a'
*/
export const listAllNotesInDirectory = (folder: TFolder): TFile[] => {
	let results: TFile[] = [];

	for (const child of folder.children) {
		if (child instanceof TFile) {
			results.push(child);
		} else if (child instanceof TFolder) {
			results = results.concat(listAllNotesInDirectory(child));
		}
	}

	return results;
}
