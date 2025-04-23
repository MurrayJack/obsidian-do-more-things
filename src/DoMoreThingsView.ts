import { exec } from 'child_process';
import { ItemView, WorkspaceLeaf, Notice, PluginManifest } from 'obsidian';
import { Things3Data, VIEW_TYPE_THINGS3 } from 'src/types';
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

		const rawHtml = await this.getTodayListByJXA();
		if (!rawHtml) {
			container.empty();
			container.createEl('p', {
				text: 'Things3 is not running, please open the application.',
			});
			return;
		}

		const data = JSON.parse(rawHtml) as Things3Data;

		render(container, this.plugin, data, (event, e) => {
			if (event === 'refresh') {
				this.refreshTodayView(0, true);
			} else if (event === 'checkbox') {
				this.handleCheckboxClick(e);
			}
		});
	}

	async handleCheckboxClick(event: Event) {
		const clickedCheckbox = event.target as HTMLInputElement;
		const isChecked = clickedCheckbox.checked;

		const todoId =
			clickedCheckbox.attributes.getNamedItem('data-tid')?.value || '';

		if (clickedCheckbox.checked) {
			clickedCheckbox.setAttribute('checked', 'true');
		} else {
			clickedCheckbox.removeAttribute('checked');
		}

		await this.completeTodoByJXA(todoId, isChecked);

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
				const todos = Application('Things').lists.byId('TMTodayListSource').toDos();
				
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

	completeTodoByJXA(todoId: string, value: boolean): Promise<string> {
		const completeSct =
			`Application('Things').toDos.byId('${todoId}').status = '${
				value ? 'completed' : 'open'
			}';`
				.replace(/"/g, '\\"')
				.replace(/\n/g, ' ');

		return new Promise((resolve) => {
			exec(
				`osascript -l JavaScript -e  "${completeSct}"`,
				(err, stdout, stderr) => {
					resolve(stdout);
				}
			);
		});
	}
}
