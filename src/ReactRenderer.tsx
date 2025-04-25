import { StrictMode, useEffect, useState } from 'react';
import { DoMoreThingsPlugin } from './DoMoreThingsPlugin';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './react/AppContext';
import { Header } from './react/Header';
import { THINGS3_LOCAL_STORAGE_KEY,  Things3Data,  Things3Todo } from './types';
import { Page } from './react/Page';
import { DoMoreThingsNoteLinker } from './linker/DoMoreThingsNoteLinker';
import { AiSuggestion } from './react/AiSuggestion';
import { Things3Manager } from './things3/Things3Manager';

export function render(_container: HTMLElement, _plugIn: DoMoreThingsPlugin) {
	const [data, setData] = useState<Things3Data|undefined>(undefined);

	const container = _container;

	const linker = new DoMoreThingsNoteLinker(_plugIn)
	const things = new Things3Manager();

	const state = JSON.parse(
		localStorage.getItem(THINGS3_LOCAL_STORAGE_KEY) || '{}'
	);

	const linkedNotes = linker.getAllLinkedNotes()
		
	const noteLinker = async (item: Things3Todo) => {
		const file = await linker.createItemNote(item);
		await linker.openItemNote(item);
		return file;
	}


    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const todos = await  things.getTodayListByJXA()

                if (isMounted) setData(JSON.parse(todos));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 30000); // poll every 30s
    
        return () => {
          isMounted = false;
          clearInterval(interval);
        };
    }, []);

	const root = createRoot(container);
	root.render(
		<StrictMode>
			<AppProvider linkedNotes={linkedNotes} data={data} linkNote={noteLinker} settings={_plugIn.settings} state={state}>
				<div className="do-more-things-main">
					
					<Header />

					<AiSuggestion />

					<div className="do-more-things-content">
						<Page />
					</div>
				</div>
			</AppProvider>
		</StrictMode>
	);
}
