import DoMoreThingsPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { DoMoreThingsPluginSetting } from './types';

export const DEFAULT_SETTINGS: DoMoreThingsPluginSetting = {
	showTags: true,
	showNotesIcon: true,
	heading: 'Do More Things',
	showExpandIcon: true,
	showHeading: true,

	// linked notes
	allowLinkedNotes: true,
	linkedNoteNamingSystem: 'id',
	linkedNoteFolderName: 'Do More Things',
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
		containerEl.createEl('p', {
			text: 'Changing the setting, requires clicking the refresh button to update, or restart the app.',
		});

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
			.setName('Heading Text')
			.setDesc('The Heading for the side panel')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.heading)
					.onChange(async (value) => {
						this.plugin.settings.heading = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Show Heading')
			.setDesc('Show the heading in the side panel')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showHeading)
					.onChange(async (value) => {
						this.plugin.settings.showHeading = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Allow Expand/Collapse Groups')
			.setDesc('Allow Expand/Collapse Groups in the list')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showExpandIcon)
					.onChange(async (value) => {
						this.plugin.settings.showExpandIcon = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl('h3', { text: 'File Linking Settings' });
		containerEl.createEl('p', {
			text: 'File Linking allows you to create a note for each item in Things3.',
		});

		new Setting(containerEl)
			.setName('Allow Linked Notes')
			.setDesc('Allow linked notes to be created')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.allowLinkedNotes)
					.onChange(async (value) => {
						this.plugin.settings.allowLinkedNotes = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Linked Note Naming System')
			.setDesc(
				'The naming system for the linked notes, note that using the name will not detect renaming and can cause duplicates'
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption('id', 'ID')
					.addOption('name', 'Name')
					.setValue(this.plugin.settings.linkedNoteNamingSystem)
					.onChange(async (value) => {
						this.plugin.settings.linkedNoteNamingSystem =
							value as any;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Linked Note Folder Name')
			.setDesc('The folder name for the linked notes')
			.addText((text) =>
				text
					.setPlaceholder('Do More Things')
					.setValue(this.plugin.settings.linkedNoteFolderName)
					.onChange(async (value) => {
						this.plugin.settings.linkedNoteFolderName = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
