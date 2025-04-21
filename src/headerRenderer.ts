export function headerRenderer() {
	return `
        <h4>Do More Things3</h4>
        <a href="things:///show?id=today">
            Open
        </a>
        <button class="things3-today-refresh">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 4px;">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 1 1 .908-.418A6 6 0 1 1 8 2v1z"/>
                <path d="M8 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h2.5V.5A.5.5 0 0 1 8 0z"/>
            </svg>
        </button>
    `;
}

export function headerHandler(container: HTMLElement, callback: () => void) {
	container
		.querySelector('.things3-today-refresh')
		?.addEventListener('click', () => {
			callback();
		});
}
