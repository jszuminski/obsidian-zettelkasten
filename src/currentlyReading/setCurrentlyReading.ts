import { Modal, TFile } from 'obsidian';
import { NoteSuggest } from 'src/shared/NoteSuggest.class';
import { IPluginType } from 'src/plugin.types';

class LiteratureNoteModal extends Modal {
  private plugin: IPluginType;
  private selectedFile: TFile | null = null;
  private saveButton: HTMLButtonElement | null = null;
  private cancelButton: HTMLButtonElement | null = null;
  private inputEl: HTMLInputElement | null = null;

  constructor(plugin: IPluginType) {
    super(plugin.app);
    this.plugin = plugin;
  }

  async updateSetting(file: TFile | null) {
    if (!file?.path) {
      return;
    }

    if (this.saveButton) {
      this.saveButton.textContent = 'Saving...';
    }

    this.plugin.settings.currentlyReadingNotePath = file.path;
    await this.plugin.saveSettings();

    if (this.saveButton) {
      this.saveButton.textContent = 'Saved';
    }
  }

  async onSave() {
    if (this.selectedFile) {
      await this.updateSetting(this.selectedFile);
      this.close();
      return;
    }

    // Try to find file by input value
    const inputValue = this.inputEl?.value.trim();
    if (inputValue) {
      // Search for file by basename
      const allFiles = this.app.vault.getMarkdownFiles();
      const foundFile = allFiles.find(
        (file) =>
          file.basename === inputValue &&
          (file.path.startsWith(
            this.plugin.settings.literatureNotesFolderPath + '/'
          ) ||
            file.path.startsWith(
              this.plugin.settings.literatureNotesFolderPath || ''
            ) ||
            !this.plugin.settings.literatureNotesFolderPath)
      );

      if (foundFile) {
        await this.updateSetting(foundFile);
        this.close();
      }
    }
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.onSave();
    }
  };

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'Select literature note' });

    // Create clean input field with autocomplete
    this.inputEl = contentEl.createEl('input', {
      type: 'text',
      placeholder: 'Start typing to search notes...',
      cls: 'literature-note-input',
    });

    // Add autocomplete functionality
    new NoteSuggest(
      this.app,
      this.inputEl,
      this.plugin.settings.literatureNotesFolderPath
    );

    // Listen for input changes to track selected file
    this.inputEl.addEventListener('input', () => {
      const filePath = this.inputEl?.getAttribute('data-file-path');

      if (!filePath) {
        this.inputEl!.removeAttribute('data-file-path');
        this.selectedFile = null;
        return;
      }

      const selected = this.app.vault.getAbstractFileByPath(filePath);

      if (
        !(selected instanceof TFile) ||
        this.inputEl!.value.trim() !== selected.basename
      ) {
        this.inputEl!.removeAttribute('data-file-path');
        this.selectedFile = null;
        return;
      }

      this.selectedFile = selected;
    });

    // Create buttons container
    const buttonContainer = contentEl.createEl('div', {
      cls: 'modal-button-container',
    });

    this.cancelButton = buttonContainer.createEl('button', {
      text: 'Cancel',
    });

    this.saveButton = buttonContainer.createEl('button', {
      text: 'Save',
      cls: 'mod-cta',
    });

    this.cancelButton.addEventListener('click', () => {
      this.close();
    });

    this.saveButton.addEventListener('click', async () => {
      this.onSave();
    });

    document.addEventListener('keydown', this.onKeyDown);
  }

  onClose() {
    this.contentEl.empty();
    document.removeEventListener('keydown', this.onKeyDown);
  }
}

export function setCurrentlyReading(plugin: IPluginType) {
  new LiteratureNoteModal(plugin).open();
}
