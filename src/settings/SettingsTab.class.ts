import { App, PluginSettingTab, Setting, TFile } from 'obsidian';
import { IPluginType } from 'src/plugin.types';
import { FolderSuggest } from 'src/shared/FolderSuggest.class';
import { NoteSuggest } from 'src/shared/NoteSuggest.class';
import { IPluginNoteSettings } from './settings.types';

const MAX_NOTE_TYPES = 10;

export class SettingsTab extends PluginSettingTab {
  plugin: IPluginType;

  constructor(app: App, plugin: IPluginType) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', {
      text: 'Global settings',
      cls: 'settings-h2',
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
      .setDesc('Automatically replaces the $currently_reading placeholder.')
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

    containerEl.createEl('hr', { cls: 'divider' });

    containerEl.createEl('h2', {
      text: 'Notes settings',
      cls: 'settings-h2',
    });

    // ===== Note Types section header + add button =====
    const header = containerEl.createEl('div', {
      cls: 'setting-item',
    });
    const headerInfo = header.createDiv({ cls: 'setting-item-info' });
    headerInfo.createEl('div', {
      cls: 'setting-item-name',
      text: 'Note types',
    });
    headerInfo.createEl('div', {
      cls: 'setting-item-description',
      text: 'Configure 0–10 note types. Each has its own template and destination folder.',
    });
    const headerControls = header.createDiv({ cls: 'setting-item-control' });
    const addBtn = headerControls.createEl('button', {
      text: 'Add note type',
      cls: 'mod-cta',
    });

    addBtn.disabled =
      (this.plugin.settings.noteTypes?.length || 0) >= MAX_NOTE_TYPES;

    addBtn.onclick = async () => {
      if (!this.plugin.settings.noteTypes) this.plugin.settings.noteTypes = [];
      if (this.plugin.settings.noteTypes.length >= MAX_NOTE_TYPES) return;

      const newType: IPluginNoteSettings = {
        name: `Type ${this.plugin.settings.noteTypes.length + 1}`,
        templatePath: '',
        locationPath: '',
      };
      this.plugin.settings.noteTypes.push(newType);
      await this.plugin.saveSettings();
      this.display(); // re-render
    };

    containerEl.createEl('hr', { cls: 'divider' });

    // ===== Render each note type as a grouped section =====
    (this.plugin.settings.noteTypes || []).forEach((nt, idx) => {
      this.renderNoteTypeSection(containerEl, nt, idx);
    });
  }

  private renderNoteTypeSection(
    containerEl: HTMLElement,
    nt: IPluginNoteSettings,
    index: number
  ) {
    // Section title bar with remove & move buttons
    const section = containerEl.createEl('div', { cls: 'setting-item' });
    const info = section.createDiv({ cls: 'setting-item-info' });
    info.createEl('div', {
      cls: 'setting-item-name',
      text: `Note type #${index + 1}`,
    });
    info.createEl('div', {
      cls: 'setting-item-description',
      text: 'A template + destination folder + per-type ID separator.',
    });

    const controls = section.createDiv({ cls: 'setting-item-control' });

    const upBtn = controls.createEl('button', { text: '↑' });
    upBtn.disabled = index === 0;
    upBtn.onclick = async () => {
      const arr = this.plugin.settings.noteTypes;
      if (!arr || index === 0) return;
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      await this.plugin.saveSettings();
      this.display();
    };

    const downBtn = controls.createEl('button', { text: '↓' });
    downBtn.disabled = index >= this.plugin.settings.noteTypes.length - 1;
    downBtn.onclick = async () => {
      const arr = this.plugin.settings.noteTypes;
      if (!arr || index >= arr.length - 1) return;
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      await this.plugin.saveSettings();
      this.display();
    };

    const removeBtn = controls.createEl('button', { text: 'Remove' });
    removeBtn.onclick = async () => {
      const arr = this.plugin.settings.noteTypes || [];
      arr.splice(index, 1);
      await this.plugin.saveSettings();
      this.display();
    };

    // Grouped fields (Name / Template / Folder / Separator)
    // Name
    new Setting(containerEl)
      .setName('Name')
      .setDesc('Label shown in commands/menus.')
      .addText((text) => {
        text
          .setPlaceholder('e.g. Daily, Project, Literature')
          .setValue(nt.name || '')
          .onChange(async (value) => {
            nt.name = value;
            await this.plugin.saveSettings();
          });
      });

    // Template note
    new Setting(containerEl)
      .setName('Template note path')
      .setDesc('Which note should be used as the template?')
      .addSearch((search) => {
        search
          .setPlaceholder('e.g. Templates/Project Note')
          .setValue(nt.templatePath || '')
          .onChange(async () => {
            const path = search.inputEl.getAttribute('data-file-path');
            nt.templatePath = path || '';
            await this.plugin.saveSettings();
          });

        new NoteSuggest(this.app, search.inputEl, '/');
      });

    // Destination folder
    new Setting(containerEl)
      .setName('Notes folder')
      .setDesc('Where to create notes of this type.')
      .addSearch((search) => {
        search
          .setPlaceholder('e.g. Notes/Projects')
          .setValue(nt.locationPath || '')
          .onChange(async (value) => {
            nt.locationPath = value;
            await this.plugin.saveSettings();
          });

        new FolderSuggest(this.app, search.inputEl);
      });

    // Visual divider
    containerEl.createEl('hr', {
      cls: 'divider',
    });
  }
}
