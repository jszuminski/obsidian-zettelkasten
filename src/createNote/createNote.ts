import { App, Modal, TFile } from "obsidian";
import { IPluginType } from "src/plugin.types";
import { CURRENTLY_READING_PLACEHOLDER } from "src/shared/config";
import { getMaxFileIdInDirectory } from "src/shared/getMaxFileIdInDirectory";
import { removeFileExtension } from "src/shared/removeFileExtension"

class CreateNoteModal extends Modal {
	private plugin: IPluginType;
	private inputEl: HTMLInputElement | null = null;
	private createButton: HTMLButtonElement | null = null;
	private cancelButton: HTMLButtonElement | null = null;

	constructor(app: App, plugin: IPluginType) {
		super(app);
		this.plugin = plugin;
	}

	async onCreate() {
		const noteTitle = this.inputEl?.value.trim();

		if (!noteTitle) {
			console.log("No note title provided");
			return;
		}

		try {
			if (this.createButton) {
				this.createButton.textContent = "Creating...";
				this.createButton.disabled = true;
			}

			const maxFileId = getMaxFileIdInDirectory({
				directory: this.plugin.settings.notesLocation,
				idSeparator: this.plugin.settings.idSeparator,
				obsidian: this.app
			})

			const fileName = `${maxFileId + 1}${this.plugin.settings.idSeparator} ${noteTitle}.md`;
			const filePath = this.plugin.settings.notesLocation
				? `${this.plugin.settings.notesLocation}/${fileName}`
				: fileName;


			// Create the note content - use template if available
			let noteContent: string;

			if (
				this.plugin.settings.noteTemplatePath &&
				this.plugin.settings.noteTemplatePath.trim()
			) {
				try {
					console.log(this.plugin.settings.noteTemplatePath);
					// Try to read the template file
					const templateFile = this.app.vault.getAbstractFileByPath(
						this.plugin.settings.noteTemplatePath
					);
					console.log("templateFile", templateFile);

					if (templateFile && templateFile instanceof TFile) {
						// Read the template content
						const templateContent = await this.app.vault.read(
							templateFile
						);

						// Start with the template content
						noteContent = templateContent;

						// Replace {{title}} placeholder with actual title
						noteContent = noteContent.replace(
							/\{\{title\}\}/g,
							noteTitle
						);

						// Replace currently reading book placeholder
						if (this.plugin.settings.currentlyReading) {
							const currentlyReadingLink = `"[[${removeFileExtension(this.plugin.settings.currentlyReading?.name)}]]"`;
							console.log(
								"currentlyReadingLink",
								currentlyReadingLink
							);
							noteContent = noteContent.replace(
								new RegExp(CURRENTLY_READING_PLACEHOLDER, "g"),
								`${currentlyReadingLink}`
							);
						} else {
							console.log("no currently reading book");
							// If no currently reading book is set, leave it empty or add a placeholder
							noteContent = noteContent.replace(
								new RegExp(CURRENTLY_READING_PLACEHOLDER, "g"),
								""
							);
						}
					} else {
						// Template file doesn't exist, use simple title
						console.warn(
							"Template file not found:",
							this.plugin.settings.noteTemplatePath
						);
						noteContent = `# ${noteTitle}\n\n`;
					}
				} catch (error) {
					console.warn(
						"Could not read template file, using simple title:",
						error
					);
					noteContent = `# ${noteTitle}\n\n`;
				}
			} else {
				// No template defined, create simple note with title
				noteContent = `# ${noteTitle}\n\n`;
			}

			// for some reason it's empty, so we're going to work around it by getting this file
			const newFile = await this.app.vault.create(filePath, noteContent);
			console.log('filePath: ', filePath);
			const newFileAbstract = this.app.vault.getFileByPath(filePath);
			console.log("newFile", newFile); // for some reason it's empty
			console.log("newFileAbstract", newFileAbstract);

			// Open the newly created note
			const leaf = this.app.workspace.getLeaf(true);
			await leaf.openFile(newFile);

			this.close();
		} catch (error) {
			console.error("Error creating note:", error);

			if (this.createButton) {
				this.createButton.textContent = "Error - Try Again";
				this.createButton.disabled = false;
			}
		}
	}

	onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			this.onCreate();
		}
		if (e.key === "Escape") {
			this.close();
		}
	};

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl("h2", { text: "Create New Note" });

		// Create input field for note title
		this.inputEl = contentEl.createEl("input", {
			type: "text",
			placeholder: "Enter note title...",
			cls: "literature-note-input",
		});

		// Focus the input field
		setTimeout(() => {
			this.inputEl?.focus();
		}, 100);

		// Create buttons container
		const buttonContainer = contentEl.createEl("div", {
			cls: "modal-button-container",
		});

		this.cancelButton = buttonContainer.createEl("button", {
			text: "Cancel",
		});

		this.createButton = buttonContainer.createEl("button", {
			text: "Create Note",
			cls: "mod-cta",
		});

		// Event listeners
		this.cancelButton.addEventListener("click", () => {
			this.close();
		});

		this.createButton.addEventListener("click", () => {
			this.onCreate();
		});

		document.addEventListener("keydown", this.onKeyDown);
	}

	onClose() {
		this.contentEl.empty();
		document.removeEventListener("keydown", this.onKeyDown);
	}
}

export function createNote(app: App, plugin: IPluginType) {
	new CreateNoteModal(app, plugin).open();
}
