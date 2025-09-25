/**
* myfile.md -> myfile
*/
export const removeFileExtension = (filename: string) => {
	const parts = filename.split('.');
	const extension = parts.pop();

	// just in case the title has multiple dots
	// ex. "My note. Beautiful note.md"
	const name = parts.join(".");

	if (!name) {
		console.warn(`Unexpected output for ${filename} where extension=${extension}`);
	}

	return name;
}
