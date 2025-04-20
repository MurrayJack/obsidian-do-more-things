import { exec } from 'child_process';
import {
	ItemView,
	WorkspaceLeaf,
	Notice,
	Plugin,
	PluginManifest,
	PluginSettingTab,
	Setting,
	App,
} from 'obsidian';

interface Things3PluginSettings {
	groupByProject: boolean;
}

const DEFAULT_SETTINGS: Things3PluginSettings = {
	groupByProject: true,
};

export const VIEW_TYPE_THINGS3 = 'things3-today';

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
		return 'Things3 Today';
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
		const container = this.containerEl.children[1];
		// get today List
		const rawHtml = await this.getTodayListByJXA();
		const parser = new DOMParser();
		const doc = parser.parseFromString(rawHtml, 'text/html');
		const node = doc.documentElement;

		container.empty();
		container.createEl('h4', { text: 'Things3 Today' });
		container.createEl('a', {
			href: 'things:///show?id=today',
			text: 'Open Today',
		});
		container.createEl('br');
		container.createEl('br');

		const button = document.createElement('button');
		button.innerText = 'Refresh';

		button.addEventListener('click', () => {
			// Notifications will only be displayed if the button is clicked.
			this.refreshTodayView(0, true);
		});

		container.appendChild(button);

		// add click event
		const inputCheckboxes = node.querySelectorAll('.things-today-checkbox');
		inputCheckboxes.forEach((checkbox) => {
			// console.log(checkbox)
			checkbox.addEventListener(
				'click',
				this.handleCheckboxClick.bind(this)
			);
		});

		// append body > subEle into container
		while (node.children[1].children.length > 0) {
			container.appendChild(node.children[1].children[0]);
		}
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
		const getTodayListSct = `"function getTodayList() { let content = ''; Application('Things').lists.byId('TMTodayListSource').toDos().forEach(t => { let checked = t.status()=='open' ? '' : 'checked'; content += '<ul><input '+ checked +'  type="checkbox" class="things-today-checkbox" tid=\\"' + t.id() + '\\"><div style="display:contents"><a href=\\"things:///show?id=' + t.id() + '\\">' + t.name() + '</a></div></ul>'; }); return content; }; getTodayList();"`;

		const getTodayListScript = `
			function getTodayList() {
				let content = '';
				const todos = Application('Things').lists.byId('TMTodayListSource').toDos();
				const grouped = {};

				todos.forEach(t => {
					const area = t.area() ? t.area().name() : undefined;
					let projectName = t.project() ? t.project().name() : undefined;
					
					if (!projectName) {
						projectName = area ? area : 'No Project';
					}

					if (!grouped[projectName]) {
						grouped[projectName] = [];
					}
					grouped[projectName].push(t);
				});

				for (const project in grouped) {
					content += '<p class="things3-today-header">' + project + '</p>';
					content += '<ul class="things3-today-list" tid="' + grouped[project][0].id() + '">';

					grouped[project].forEach(t => {
						const checked = t.status() === 'open' ? '' : 'checked';
						const tags = t.tags().map(tag => tag.name()).join(', ');

						content += '<li class="things3-today-list-item">';
						content += '<input type="checkbox" class="things-today-checkbox" ' + checked + ' tid="' + t.id() + '" />';
						content += '<a href="things:///show?id=' + t.id() + '">' + t.name() + '</a>';

						if (tags.length > 0) {
							content += '<span class="things3-today-list-tag">[' + tags + ']</span>';
						}

						content += '</a></li>';
					});
					content += '</ul>';
				}

				return '<div class="things3-today-content">' + content + '</div>';
			}
			getTodayList();
		`
			.replace(/"/g, '\\"')
			.replace(/\n/g, ' ');

		return new Promise((resolve) => {
			if (this.plugin.settings.groupByProject) {
				exec(
					`osascript -l JavaScript -e "${getTodayListScript}"`,
					(err, stdout, stderr) => {
						resolve(stdout);
					}
				);
			} else {
				exec(
					`osascript -l JavaScript -e ` + getTodayListSct,
					(err, stdout, stderr) => {
						resolve(stdout);
					}
				);
			}
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
		containerEl.createEl('h2', { text: 'Things3 Plugin Settings' });

		new Setting(containerEl)
			.setName('Group By Project')
			.setDesc(
				'Whether to group tasks by project in the Today view, click the refresh button force the new view.'
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.groupByProject)
					.onChange(async (value) => {
						this.plugin.settings.groupByProject = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
