import DoMoreThingsPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { Things3PluginSettings } from './types';

export const DEFAULT_SETTINGS: Things3PluginSettings = {
	showTags: true,
	showNotesIcon: true,
	heading: 'Do More Things',
	excludeProjects: '',
	showExpandIcon: true,
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

		new Setting(containerEl)
			.setName('Heading')
			.setDesc('Heading for the list')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.heading)
					.onChange(async (value) => {
						this.plugin.settings.heading = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Exclude Projects')
			.setDesc('Comma separated list of projects to exclude')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.excludeProjects)
					.onChange(async (value) => {
						this.plugin.settings.excludeProjects = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Show Expand Icon')
			.setDesc('Show expand icon in the list')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showExpandIcon)
					.onChange(async (value) => {
						this.plugin.settings.showExpandIcon = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
