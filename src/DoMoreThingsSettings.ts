import DoMoreThingsPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { Things3PluginSettings } from './types';

export const DEFAULT_SETTINGS: Things3PluginSettings = {
	showTags: true,
	showNotesIcon: true,
	heading: 'Do More Things',
	excludeProjects: '',
};

export class DoMoreThingsSettings extends PluginSettingTab {
	plugin: DoMoreThingsPlugin;

	constructor(app: App, plugin: DoMoreThingsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h2', { text: 'Do More Things Plugin Settings' });

		new Setting(containerEl)
			.setName('Show Tags')
			.setDesc('Show tags in the list')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showTags)
					.onChange(async (value) => {
						this.plugin.settings.showTags = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Show Notes Icon')
			.setDesc('Show notes icon in the list')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showNotesIcon)
					.onChange(async (value) => {
						this.plugin.settings.showNotesIcon = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
