import { Things3PluginSettings, VIEW_TYPE_THINGS3 } from './types';
import { WorkspaceLeaf, Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	DoMoreThingsSettings,
} from 'src/DoMoreThingsSettings';
import { DoMoreThingsView } from 'src/DoMoreThingsView';

export class DoMoreThingsPlugin extends Plugin {
	settings: Things3PluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'open-dmt-today',
			name: 'Open Today',
			callback: () => {
				this.activateThings3View();
			},
		});

		this.registerView(
			VIEW_TYPE_THINGS3,
			(leaf) => new DoMoreThingsView(leaf, this)
		);

		this.addRibbonIcon('check-square', 'Open Do More Things', () => {
			this.activateThings3View();
		});

		this.addSettingTab(new DoMoreThingsSettings(this.app, this));

		this.app.workspace.onLayoutReady(this.activateThings3View.bind(this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateThings3View() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_THINGS3);
		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_THINGS3, active: true });
		}

		workspace.revealLeaf(leaf);
	}
}
