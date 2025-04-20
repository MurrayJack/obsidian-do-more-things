import { exec } from "child_process";
import {
	ItemView,
	WorkspaceLeaf,
	Notice,
	Plugin,
	PluginManifest,
} from "obsidian";

export const VIEW_TYPE_THINGS3 = "things3-today";

export default class ObsidianThings3 extends Plugin {
	async onload() {
		this.addCommand({
			id: "open-today",
			name: "Open Today",
			callback: () => {
				this.activateThings3View();
			},
		});

		this.registerView(
			VIEW_TYPE_THINGS3,
			(leaf) => new ThingsView(leaf, this.manifest)
		);

		this.addRibbonIcon("check-square", "Open Things3 Today", () => {
			this.activateThings3View();
		});

		// trigger this on layout ready
		this.app.workspace.onLayoutReady(this.activateThings3View.bind(this));
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

	constructor(leaf: WorkspaceLeaf, manifest: PluginManifest) {
		super(leaf);
		this.manifest = manifest;
	}

	getIcon(): string {
		// https://github.com/obsidianmd/obsidian-api/issues/3
		return "check-square";
	}

	getViewType() {
		return VIEW_TYPE_THINGS3;
	}

	getDisplayText() {
		return "Things3 Today";
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
		const doc = parser.parseFromString(rawHtml, "text/html");
		const node = doc.documentElement;

		container.empty();
		container.createEl("h4", { text: "Things3 Today" });
		container.createEl("a", {
			href: "things:///show?id=today",
			text: "Open Today",
		});
		container.createEl("br");
		container.createEl("br");

		const button = document.createElement("button");
		button.innerText = "Refresh";

		button.addEventListener("click", () => {
			// Notifications will only be displayed if the button is clicked.
			this.refreshTodayView(0, true);
		});

		container.appendChild(button);

		// add click event
		const inputCheckboxes = node.querySelectorAll(".things-today-checkbox");
		inputCheckboxes.forEach((checkbox) => {
			// console.log(checkbox)
			checkbox.addEventListener(
				"click",
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
			clickedCheckbox.attributes.getNamedItem("tid")?.value || "";
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
				new Notice("Today Refreshed");
			}
		}, delay);
	}

	getTodayListByJXA(): Promise<string> {
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
					content += '<p style="font-weight:bold;border-bottom: 1px solid #333;padding:0;margin:0;margin-bottom:0.5rem;padding-bottom:0.25rem">' + project + '</p>';
					content += '<ul style="display:grid;gap:0.5rem;list-style:none;padding:0;margin:0;padding-bottom:2rem" tid="' + grouped[project][0].id() + '">';

					grouped[project].forEach(t => {
						const checked = t.status() === 'open' ? '' : 'checked';
						const tags = t.tags().map(tag => tag.name()).join(', ');

						content += '<li style="display:flex;gap:0.5rem;align-items:center;">';
						content += '<input type="checkbox" class="things-today-checkbox" ' + checked + ' tid="' + t.id() + '" />';
						content += '<a href="things:///show?id=' + t.id() + '">' + t.name() + '</a>';

						if (tags.length > 0) {
							content += '<span style="font-size: 0.8em; color: #888;">[' + tags + ']</span>';
						}

						content += '</a></li>';
					});
					content += '</ul>';
				}

				return '<div style="padding-top:2rem">' + content + '</div>';
			}
			getTodayList();
		`
			.replace(/"/g, '\\"')
			.replace(/\n/g, " ");

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
