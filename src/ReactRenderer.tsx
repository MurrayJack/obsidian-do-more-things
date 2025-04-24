import { StrictMode } from 'react';
import { DoMoreThingsPlugin } from './DoMoreThingsPlugin';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './react/AppContext';
import { Header } from './react/Header';
import { CallBackType, THINGS3_LOCAL_STORAGE_KEY, Things3Data, Things3Todo } from './types';
import { Page } from './react/Page';
import { DoMoreThingsNoteLinker } from './DoMoreThingsNoteLinker';

export function render(_container: HTMLElement, _plugIn: DoMoreThingsPlugin, data: Things3Data, callBack: CallBackType) {
	const container = _container;

	const linker = new DoMoreThingsNoteLinker(_plugIn)

	// Clear the container
	container.empty();

	const state = JSON.parse(
		localStorage.getItem(THINGS3_LOCAL_STORAGE_KEY) || '{}'
	);

	// get any linked notes
	const linkedNotes = linker.getAllLinkedNotes()
		
	const noteLinker = async (item: Things3Todo) => {
		const file = await linker.createItemNote(item);
		await linker.openItemNote(item);

		return file;
	}

	const root = createRoot(container);
	root.render(
		<StrictMode>
			<AppProvider linkedNotes={linkedNotes} linkNote={noteLinker} data={data} settings={_plugIn.settings} state={state} callBack={callBack}>
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
