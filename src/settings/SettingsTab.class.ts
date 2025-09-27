import { App, PluginSettingTab, Setting, TFile } from 'obsidian';
import { IPluginType } from 'src/plugin.types';
import { FolderSuggest } from 'src/shared/FolderSuggest.class';
import { NoteSuggest } from 'src/shared/NoteSuggest.class';

export class SettingsTab extends PluginSettingTab {
  plugin: IPluginType;

  constructor(app: App, plugin: IPluginType) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Literature notes location')
      .setDesc('Where do you store all your literature notes?')
      .addSearch((search) => {
        search
          .setPlaceholder('ex. Literature')
          .setValue(this.plugin.settings.literatureNotesFolderPath || '')
          .onChange(async (value) => {
            this.plugin.settings.literatureNotesFolderPath = value;
            await this.plugin.saveSettings();
          });

        new FolderSuggest(this.app, search.inputEl);
      });

    new Setting(containerEl)
      .setName('Currently reading book')
      .setDesc('What is the currently reading book?')
      .addSearch((search) => {
        search.setPlaceholder('ex. Currently Reading');
        search.setValue(this.plugin.settings.currentlyReadingNotePath || '');
        search.onChange(async (value) => {
          this.plugin.settings.currentlyReadingNotePath = value;
          await this.plugin.saveSettings();
        });

        new NoteSuggest(
          this.app,
          search.inputEl,
          this.plugin.settings.literatureNotesFolderPath
        );
      });

    new Setting(containerEl)
      .setName('Note template path')
      .setDesc('Where do you store your note template?')
      .addSearch((search) => {
        search.setPlaceholder('ex. Note Template');
        search.setValue(this.plugin.settings.noteTemplatePath || '');
        search.onChange(async (value) => {
          const path = search.inputEl.getAttribute('data-file-path');
          this.plugin.settings.noteTemplatePath = path || '';
          await this.plugin.saveSettings();
        });

        new NoteSuggest(this.app, search.inputEl, '/');
      });

    new Setting(containerEl)
      .setName('Notes location')
      .setDesc('Where do you store your notes?')
      .addSearch((search) => {
        search.setPlaceholder('ex. Notes');
        search.setValue(this.plugin.settings.notesLocation || '');
        search.onChange(async (value) => {
          this.plugin.settings.notesLocation = value;
          await this.plugin.saveSettings();
        });

        new FolderSuggest(this.app, search.inputEl);
      });

    new Setting(containerEl)
      .setName('ID separator')
      .setDesc("'.' if your note titles look like '15. Note title'")
      .addText((text) => {
        text.setPlaceholder('. or / or )');
        text.setValue(this.plugin.settings.idSeparator);
        text.onChange(async (value) => {
          this.plugin.settings.idSeparator = value;
          await this.plugin.saveSettings();
        });
      });
  }
}
