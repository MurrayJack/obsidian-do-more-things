import { exec } from 'child_process';
import {
	ItemView,
	WorkspaceLeaf,
	Notice,
	Plugin,
	PluginManifest,
	PluginSettingTab,
	App,
} from 'obsidian';
import { bodyHandler, bodyRenderer } from 'src/bodyRenderer';
import { headerHandler, headerRenderer } from 'src/headerRenderer';
import { tagsHandler, tagsRenderer } from 'src/tagsRenderer';
import { Things3Data, Things3PluginSettings } from 'src/types';

const DEFAULT_SETTINGS: Things3PluginSettings = {
	listId: 'TMTodayListSource',
	panelTitle: 'Do More Things',
};

export const VIEW_TYPE_THINGS3 = 'do-more-things';

export default class ObsidianThings3 extends Plugin {
	settings: Things3PluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'open-today',
			name: 'Open Today',
			callback: () => {
				this.activateThings3View();
			},
		});

		this.registerView(
			VIEW_TYPE_THINGS3,
			(leaf) => new ThingsView(leaf, this)
		);

		this.addRibbonIcon('check-square', 'Open Things3 Today', () => {
			this.activateThings3View();
		});

		this.addSettingTab(new Things3SettingTab(this.app, this));

		// trigger this on layout ready
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

export class ThingsView extends ItemView {
	intervalValue: NodeJS.Timer;
	refreshTimer: NodeJS.Timer;
	manifest: PluginManifest;
	plugin: ObsidianThings3;

	constructor(leaf: WorkspaceLeaf, plugin: ObsidianThings3) {
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
		this.refreshTodayView(0);
		this.intervalValue = setInterval(() => {
			this.refreshTodayView(0);
		}, 1000 * 30);
	}

	async onClose() {
		clearInterval(this.intervalValue);
		clearTimeout(this.refreshTimer);
	}

	async getAndShowTodayTodos() {
		const container = this.containerEl.children[1] as HTMLElement;

		// get today List
		const rawHtml = await this.getTodayListByJXA();
		const data = JSON.parse(rawHtml) as Things3Data;

		this.buildUI(container, data, (tag: string) => {});
	}

	buildUI(
		container: HTMLElement,
		data: Things3Data,
		callback: (tag: string) => void
	) {
		container.empty();

		const html = `
			<div class="things3-today-main">
				<div class="things3-today-header">
					${headerRenderer()}
				</div>
				
				<div class="things3-today-content">
					${bodyRenderer(data)}
				</div>
			</div>
		`;

		// 	<div class="things3-today-tags">
		// 	${tagsRenderer(data)}
		// </div>

		container.empty();
		container.innerHTML = html;

		headerHandler(container, () => this.refreshTodayView(0, true));
		tagsHandler(container, callback);
		bodyHandler(container, () => this.handleCheckboxClick.bind(this));
	}

	async handleCheckboxClick(event: MouseEvent) {
		const clickedCheckbox = event.target as HTMLInputElement;

		const todoId =
			clickedCheckbox.attributes.getNamedItem('tid')?.value || '';
		await this.completeTodoByJXA(todoId);

		clickedCheckbox.parentNode?.detach();

		// things3 is too slow to refresh this immediately
		this.refreshTodayView(3000);
	}

	refreshTodayView(delay?: number, notice = false) {
		clearTimeout(this.refreshTimer);

		this.refreshTimer = setTimeout(() => {
			this.getAndShowTodayTodos();
			if (notice) {
				new Notice('Today Refreshed');
			}
		}, delay);
	}

	getTodayListByJXA(): Promise<string> {
		const getTodayListScript = `
			function buildJson() {
				const json = {};
				const todos = Application('Things').lists.byId('${this.plugin.settings.listId}').toDos();
				
				json.groups = [];
				json.tags = [];

				todos.forEach(t => {
					const area = t.area() ? t.area().name() : undefined;
					let projectName = t.project() ? t.project().name() : undefined;
					
					if (!projectName) {
						projectName = area ? area : 'No Project';
					}

					if (!json.groups.includes(projectName)) {
						json.groups.push(projectName);
					}

					json[projectName] = json[projectName] || [];

					if (t.tags().length > 0) {
						t.tags().forEach(tag => {
							if (!json.tags.includes(tag.name())) {
								json.tags.push(tag.name());
							}
						});
					}

					json[projectName].push({
						id: t.id(),
						name: t.name(),
						group: projectName,
						area: t.area() ? t.area().name() : undefined,
						project: t.project() ? t.project().name() : undefined,
						status: t.status(),
						notes: t.notes(),
						hasNotes: t.notes()?.length ? true : false,
						tags: t.tags().map(tag => tag.name()),
						dueDate: t.dueDate() ? t.dueDate().toString() : undefined,
					});
				});

				return JSON.stringify(json, null, 2);
			}
			buildJson();
		`
			.replace(/"/g, '\\"')
			.replace(/\n/g, ' ');

		return new Promise((resolve) => {
			exec(
				`osascript -l JavaScript -e "${getTodayListScript}"`,
				(err, stdout, stderr) => {
					resolve(stdout);
				}
			);
		});
	}

	completeTodoByJXA(todoId: string): Promise<string> {
		const completeSct =
			`"Application('Things').toDos.byId('` +
			todoId +
			`').status = 'completed'"`;

		return new Promise((resolve) => {
			exec(
				`osascript -l JavaScript -e ` + completeSct,
				(err, stdout, stderr) => {
					resolve(stdout);
				}
			);
		});
	}
}

class Things3SettingTab extends PluginSettingTab {
	plugin: ObsidianThings3;

	constructor(app: App, plugin: ObsidianThings3) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h2', { text: 'Do More Things Plugin Settings' });
	}
}
