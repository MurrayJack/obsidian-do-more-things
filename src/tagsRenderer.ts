import { Things3Data } from './types';

export const tagsRenderer = (data: Things3Data) => {
	let html = `<span class="things3-today-tag selected">All</span>`;
	data.tags.forEach((tag: string) => {
		html += `<span class="things3-today-tag">${tag}</span>`;
	});
	return html;
};

export function tagsHandler(
	element: HTMLElement,
	callback: (tag: string) => void
) {
	element
		.querySelectorAll('.things3-today-tag')
		.forEach((tag: HTMLElement) => {
			tag.addEventListener('click', () => {
				const selectedTag = tag.innerText;
				const tags = element.querySelectorAll('.things3-today-tag');
				tags.forEach((t: HTMLElement) => {
					if (t.innerText === selectedTag) {
						t.classList.add('selected');
					} else {
						t.classList.remove('selected');
					}
				});

				callback(selectedTag);
			});
		});
}
