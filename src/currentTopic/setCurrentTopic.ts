import { Modal, TFile } from 'obsidian';
import { NoteSuggest } from 'src/shared/NoteSuggest.class';
import { IPluginType } from 'src/plugin.types';

class CurrentTopicModal extends Modal {
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

    this.plugin.settings.currentTopicNotePath = file.path;
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

    const inputValue = this.inputEl?.value.trim();

    if (inputValue) {
      const allFiles = this.app.vault.getMarkdownFiles();
      const foundFile = allFiles.find((file) => file.basename === inputValue);

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

    contentEl.createEl('h2', { text: 'Select current topic note' });

    // Create clean input field with autocomplete
    this.inputEl = contentEl.createEl('input', {
      type: 'text',
      placeholder: 'Start typing to search notes...',
      cls: 'literature-note-input',
    });

    new NoteSuggest(this.app, this.inputEl, '');

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

export function setCurrentTopic(plugin: IPluginType) {
  new CurrentTopicModal(plugin).open();
}
