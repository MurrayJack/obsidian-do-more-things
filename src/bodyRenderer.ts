import { Things3Data, Things3Todo } from './types';

export function bodyRenderer(data: Things3Data) {
	return data.groups
		.map((group: string) => {
			return `
                <p class="things3-today-title">${group}</p>
                <ul class="things3-today-list">
                    ${renderGroupList(data[group])}
                </ul>
            `;
		})
		.join('');
}

function renderGroupList(todos: Things3Todo[]) {
	return todos
		.map((todo: Things3Todo) => {
			return `
                <li class="things3-today-list-item">
                    ${renderCheckbox(todo)}
                    ${renderLink(todo.name, todo.id)}
					${renderNotes(todo.hasNotes)}
                    ${renderTags(todo.tags)}
                </li>
            `;
		})
		.join('');
}

function renderCheckbox(todo: Things3Todo) {
	const checked = todo.status === 'open' ? '' : 'checked';
	return `
        <input ${checked} type="checkbox" class="things-today-checkbox" tid="${todo.id}" />
    `;
}

function renderLink(name: string, id: string) {
	return `
        <a href="things:///show?id=${id}">
            ${name}
        </a>
    `;
}

function renderNotes(hasNotes: boolean) {
	if (!hasNotes) {
		return `
		<svg class="things3-today-note-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M4 4h16v16H4z"/>
			<line x1="8" y1="8" x2="16" y2="8"/>
			<line x1="8" y1="12" x2="16" y2="12"/>
			<line x1="8" y1="16" x2="12" y2="16"/>
		</svg>`;
	} else {
		return `<div></div>`;
	}
}

function renderTags(tags: string[]) {
	if (!tags || tags.length === 0) {
		return '';
	}

	return tags.map((tag) => {
		return `<span class="things3-today-list-tag">${tag}</span>`;
	});

	// return `<span class="things3-today-list-tag">[${tags}]</span>`;
}

export function bodyHandler(container: HTMLElement, callback: () => void) {
	// add click event
	const inputCheckboxes = container.querySelectorAll(
		'.things-today-checkbox'
	);
	inputCheckboxes.forEach((checkbox) => {
		// console.log(checkbox)
		checkbox.addEventListener('click', callback);
	});
}
