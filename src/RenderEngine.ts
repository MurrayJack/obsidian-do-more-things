import { DoMoreThingsPlugin } from './DoMoreThingsPlugin';
import { Things3Data, Things3Todo } from './types';

export class RenderEngine {
	constructor(
		private readonly _container: HTMLElement,
		private readonly _plugIn: DoMoreThingsPlugin
	) {}

	render(data: Things3Data, callback: (event: string, e: Event) => void) {
		const template = document.createElement('template');

		template.innerHTML = `
			<div class="do-more-things-main">
				<div class="do-more-things-header">
                    <h4>${this._plugIn.settings.heading}</h4>
                    <a href="things:///show?id=today">
                        Open
                    </a>
                    <button class="do-more-things-refresh">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 1 1 .908-.418A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h2.5V.5A.5.5 0 0 1 8 0z"/>
                        </svg>
                    </button>
				</div>

				<div class="do-more-things-content">
					${this._bodyRenderer(data)}
				</div>
			</div>
		`;

		this._container.empty();
		this._container.appendChild(template.content.cloneNode(true));

		this._container
			.querySelector('.do-more-things-refresh')
			?.addEventListener('click', (e) => {
				callback('refresh', e);
			});

		this._container
			.querySelectorAll('.do-more-things-title-button')
			.forEach((button) => {
				button.addEventListener('click', (e) => {
					const elem = e.currentTarget as HTMLElement;
					const group = elem.dataset.group;
					const list = this._container.querySelector(
						`ul[data-group="${group}"]`
					) as HTMLElement;

					const isHidden = list.classList.contains('hidden');
					if (isHidden) {
						list.classList.remove('hidden');
						elem.classList.remove('pressed');
					} else {
						list.classList.add('hidden');
						elem.classList.add('pressed');
					}

					//save to local storage
					const data = JSON.parse(
						localStorage.getItem('do-more-things') || '{}'
					);
					this._container
						.querySelectorAll(`ul[data-group="${group}"]`)
						.forEach((list: HTMLElement) => {
							const group = list.dataset.group as string;
							const isHidden = list.classList.contains('hidden');
							if (group) {
								data[group] = isHidden;
							}
							localStorage.setItem(
								'do-more-things',
								JSON.stringify(data)
							);
						});
				});
			});

		const inputCheckboxes = this._container.querySelectorAll(
			'.things-today-checkbox'
		);

		inputCheckboxes.forEach((checkbox) => {
			checkbox.addEventListener('click', (e) => {
				callback('checkbox', e);
			});
		});

		const storage = JSON.parse(
			localStorage.getItem('do-more-things') || '{}'
		);

		for (const group in storage) {
			const list = this._container.querySelector(
				`ul[data-group="${group}"]`
			) as HTMLElement;
			if (list) {
				if (storage[group]) {
					list.classList.add('hidden');
				} else {
					list.classList.remove('hidden');
				}
			}
		}
	}

	private _bodyRenderer(data: Things3Data) {
		return data.groups
			.map((group: string) => {
				return `
                    <p class="do-more-things-title">
						<span>${group}</span>
						<button data-group="${group}" class="do-more-things-title-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="6 15 12 9 18 15" />
							</svg>
						</button>
					</p>
                    
					<ul data-group="${group}" class="do-more-things-list">
                        ${this._renderGroupList(data[group])}
                    </ul>
                `;
			})
			.join('');
	}

	private _renderGroupList(todos: Things3Todo[]) {
		return todos
			.map((todo: Things3Todo) => {
				return `
                    <li class="do-more-things-list-item">
                        ${this._renderCheckbox(todo)}
                        ${this._renderLink(todo.name, todo.id)}
                        ${this._renderNotes(todo.hasNotes)}
                        ${this._renderTags(todo.tags)}
                    </li>
                `;
			})
			.join('');
	}

	private _renderCheckbox(todo: Things3Todo) {
		const checked = todo.status === 'open' ? '' : 'checked';
		return `
            <input ${checked} type="checkbox" class="things-today-checkbox" tid="${todo.id}" />
        `;
	}

	private _renderLink(name: string, id: string) {
		return `
            <a href="things:///show?id=${id}">
                ${name}
            </a>
        `;
	}

	private _renderNotes(hasNotes: boolean) {
		if (!this._plugIn.settings.showNotesIcon) {
			return `<div></div>`;
		}

		if (!hasNotes) {
			return `
				<svg class="do-more-things-note-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 4h16v16H4z"/>
					<line x1="8" y1="8" x2="16" y2="8"/>
					<line x1="8" y1="12" x2="16" y2="12"/>
					<line x1="8" y1="16" x2="12" y2="16"/>
				</svg>`;
		} else {
			return `<div></div>`;
		}
	}

	private _renderTags(tags: string[]) {
		if (!this._plugIn.settings.showTags) {
			return ``;
		}

		if (!tags || tags.length === 0) {
			return '';
		}

		return `<span class="do-more-things-list-tag">${tags.join(
			', '
		)}</span>`;
	}
}
