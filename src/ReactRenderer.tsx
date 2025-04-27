import { StrictMode } from 'react';
import { DoMoreThingsPlugin } from './DoMoreThingsPlugin';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';

export function render(container: HTMLElement, plugIn: DoMoreThingsPlugin) {
	const root = createRoot(container);
	root.render(
		<StrictMode>
			<App plugIn={plugIn} />
		</StrictMode>
	);
}
