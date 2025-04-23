import { StrictMode } from 'react';
import { DoMoreThingsPlugin } from './DoMoreThingsPlugin';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './react/AppContext';
import { Header } from './react/Header';
import { Things3Data } from './types';
import { Page } from './react/Page';

export function render(_container: HTMLElement, _plugIn: DoMoreThingsPlugin, data: Things3Data, callBack: (event: "refresh" | "checkbox", e: Event) => void) {
	const container = _container;

	const state = JSON.parse(
		localStorage.getItem('do-more-things-state') || '{}'
	);

	const root = createRoot(container);
	root.render(
		<StrictMode>
			<AppProvider data={data} settings={_plugIn.settings} state={state} callBack={callBack}>
				<div className="do-more-things-main">
					
					<Header />

					<div className="do-more-things-content">
						<Page />
					</div>
				</div>
			</AppProvider>
		</StrictMode>
	);
}
