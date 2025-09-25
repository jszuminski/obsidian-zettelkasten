import { App, TFolder } from "obsidian";
import { listAllNotesInDirectory } from "./listAllNotesInDirectory";

/**
* We are using auto-increment of our note IDs.
* In order to do that, we need to be able to find the maximum
* file id in a given directory, for example:
* 
* Input: [10. Politics], [11. Society]
* Output: 11 (as it's the max ID)
*
* @todo write a unit test for this
*/
export const getMaxFileIdInDirectory = ({
	directory,
	idSeparator,
	obsidian,
}: {
	directory: string;
	idSeparator: string;
	obsidian: App;
}) => {
	const abstractDir = obsidian.vault.getAbstractFileByPath(directory)

	if (!(abstractDir instanceof TFolder)) {
		return 0;
	}

	const files = listAllNotesInDirectory(abstractDir);

	let maxFileId = 0;

	for (const file of files) {
		const id = file.name.split(idSeparator)?.[0]?.trim();
		const idInt = parseInt(id);

		if (isNaN(idInt)) {
			continue;
		}

		maxFileId = Math.max(maxFileId, idInt);
	}


	return maxFileId;
}
