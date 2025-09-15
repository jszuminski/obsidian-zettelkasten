import { Modal, App, TFile } from "obsidian";
import { NoteSuggest } from "src/shared/NoteSuggest.class";
import { IPluginType } from "src/plugin.types";

class LiteratureNoteModal extends Modal {
	private plugin: IPluginType;
	private selectedFile: TFile | null = null;
	private saveButton: HTMLButtonElement | null = null;
	private cancelButton: HTMLButtonElement | null = null;
	private inputEl: HTMLInputElement | null = null;

	constructor(app: App, plugin: IPluginType) {
		super(app);
		this.plugin = plugin;
	}

	async onSave() {
		console.log("onSave");

		console.log("this plugin settings: ", this.plugin.settings);

		if (this.selectedFile) {
			console.log("Selected literature note:", {
				name: this.selectedFile.basename,
				path: this.selectedFile.path,
				file: this.selectedFile,
			});
			this.close();
		} else {
			// Try to find file by input value
			const inputValue = this.inputEl?.value.trim();
			if (inputValue) {
				// Search for file by basename
				const allFiles = this.app.vault.getMarkdownFiles();
				const foundFile = allFiles.find(
					(file) =>
						file.basename === inputValue &&
						(file.path.startsWith(
							this.plugin.settings.literatureNotesLocation + "/"
						) ||
							file.path.startsWith(
								this.plugin.settings.literatureNotesLocation
							) ||
							!this.plugin.settings.literatureNotesLocation)
				);

				if (foundFile) {
					this.plugin.settings.currentlyReading = {
						name: foundFile.basename,
						path: foundFile.path,
						file: foundFile,
					};

					if (this.saveButton) {
						this.saveButton.textContent = "Saving...";
					}

					await this.plugin.saveSettings();

					if (this.saveButton) {
						this.saveButton.textContent = "Saved";
					}

					this.close();
				} else {
					console.log("No file selected or file not found");
				}
			} else {
				console.log("No file selected");
			}
		}
	}

	onKeyDown = (e: KeyboardEvent) => {
		console.log("onKeyDown", e.key);
		if (e.key === "Enter") {
			// this.onSave();
		}
	};

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl("h2", { text: "Select Literature Note" });

		// Create clean input field with autocomplete
		this.inputEl = contentEl.createEl("input", {
			type: "text",
			placeholder: "Start typing to search notes...",
			cls: "literature-note-input",
		});

		// Add autocomplete functionality
		new NoteSuggest(
			this.app,
			this.inputEl,
			this.plugin.settings.literatureNotesLocation
		);

		// Listen for input changes to track selected file
		this.inputEl.addEventListener("input", () => {
			const filePath = this.inputEl?.getAttribute("data-file-path");
			if (filePath) {
				this.selectedFile = this.app.vault.getAbstractFileByPath(
					filePath
				) as TFile;
			} else {
				this.selectedFile = null;
			}
		});

		// Create buttons container
		const buttonContainer = contentEl.createEl("div", {
			cls: "modal-button-container",
		});

		this.cancelButton = buttonContainer.createEl("button", {
			text: "Cancel",
		});

		this.saveButton = buttonContainer.createEl("button", {
			text: "Save",
			cls: "mod-cta",
		});

		this.cancelButton.addEventListener("click", () => {
			this.close();
		});

		this.saveButton.addEventListener("click", () => {
			if (this.selectedFile) {
				console.log("Selected literature note:", {
					name: this.selectedFile.basename,
					path: this.selectedFile.path,
					file: this.selectedFile,
				});
				this.close();
			} else {
				// Try to find file by input value
				const inputValue = this.inputEl?.value.trim();
				if (inputValue) {
					// Search for file by basename
					const allFiles = this.app.vault.getMarkdownFiles();
					const foundFile = allFiles.find(
						(file) =>
							file.basename === inputValue &&
							(file.path.startsWith(
								this.plugin.settings.literatureNotesLocation +
									"/"
							) ||
								file.path.startsWith(
									this.plugin.settings.literatureNotesLocation
								) ||
								!this.plugin.settings.literatureNotesLocation)
					);

					if (foundFile) {
						console.log("Selected literature note:", {
							name: foundFile.basename,
							path: foundFile.path,
							file: foundFile,
						});
						this.close();
					} else {
						console.log("No file selected or file not found");
					}
				} else {
					console.log("No file selected");
				}
			}
		});

		document.addEventListener("keydown", this.onKeyDown);
	}

	onClose() {
		this.contentEl.empty();
		document.removeEventListener("keydown", this.onKeyDown);
	}
}

export function setCurrentlyReading(app: App, plugin: IPluginType) {
	new LiteratureNoteModal(app, plugin).open();
}
