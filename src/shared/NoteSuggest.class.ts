import { AbstractInputSuggest, App, TFile } from 'obsidian';

export class NoteSuggest extends AbstractInputSuggest<TFile> {
  private notes: TFile[];
  private inputEl: HTMLInputElement;

  constructor(app: App, inputEl: HTMLInputElement, folderPath: string | null) {
    super(app, inputEl);
    this.inputEl = inputEl;

    this.notes = this.app.vault.getMarkdownFiles().filter((file) => {
      if (!folderPath || folderPath === '/') {
        return true;
      }

      return (
        file.path.startsWith(folderPath + '/') ||
        file.path.startsWith(folderPath)
      );
    });
  }

  getSuggestions(inputStr: string): TFile[] {
    const inputLower = inputStr.toLowerCase();

    return this.notes.filter(
      (file) =>
        file.basename.toLowerCase().includes(inputLower) ||
        file.path.toLowerCase().includes(inputLower)
    );
  }

  renderSuggestion(file: TFile, el: HTMLElement): void {
    const container = el.createEl('div', { cls: 'suggestion-item' });

    container.createEl('div', {
      text: file.basename,
      cls: 'suggestion-title',
    });

    if (file.path !== file.basename + '.md') {
      container.createEl('div', {
        text: file.path,
        cls: 'suggestion-note-subtitle',
      });
    }
  }

  selectSuggestion(file: TFile): void {
    this.inputEl.value = file.basename;
    this.inputEl.setAttribute('data-file-path', file.path);

    const event = new Event('input');
    this.inputEl.dispatchEvent(event);

    this.close();
  }
}
