import { ItemView, WorkspaceLeaf, PluginManifest } from 'obsidian';
import { VIEW_TYPE_THINGS3 } from 'src/types';
import DoMoreThingsPlugin from 'main';
import { render } from './ReactRenderer';

export class DoMoreThingsView extends ItemView {
	intervalValue: NodeJS.Timer;
	refreshTimer: NodeJS.Timer;
	manifest: PluginManifest;
	plugin: DoMoreThingsPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: DoMoreThingsPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getIcon(): string {
		// https://github.com/obsidianmd/obsidian-api/issues/3
		return 'check-square';
	}

	getViewType() {
		return VIEW_TYPE_THINGS3;
	}

	getDisplayText() {
		return 'Do More Things';
	}

	async onOpen() {
		this.getAndShowTodayTodos();
	}

	async onClose() {
		clearInterval(this.intervalValue);
		clearTimeout(this.refreshTimer);
	}

	async getAndShowTodayTodos() {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();

		render(container, this.plugin);
	}
}
