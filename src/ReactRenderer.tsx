import { StrictMode } from 'react';
import { DoMoreThingsPlugin } from './DoMoreThingsPlugin';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './react/AppContext';
import { Header } from './react/Header';
import { CallBackType, THINGS3_LOCAL_STORAGE_KEY, Things3Data } from './types';
import { Page } from './react/Page';

export function render(_container: HTMLElement, _plugIn: DoMoreThingsPlugin, data: Things3Data, callBack: CallBackType) {
	const container = _container;

	// Clear the container
	container.empty();

	// there might not be any data as things3 is not running

	const state = JSON.parse(
		localStorage.getItem(THINGS3_LOCAL_STORAGE_KEY) || '{}'
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
