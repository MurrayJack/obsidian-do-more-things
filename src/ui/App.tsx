import { useEffect, useState } from 'react';
import { DoMoreThingsPlugin } from '../DoMoreThingsPlugin';
import { AppProvider } from './AppContext';
import { Header } from './Header';
import { THINGS3_LOCAL_STORAGE_KEY, Things3Data, Things3Todo } from '../types';
import { Page } from './Page';
import { DoMoreThingsNoteLinker } from '../linker/DoMoreThingsNoteLinker';
import { AiSuggestion } from './AiSuggestion';
import { Things3Manager } from '../things3/Things3Manager';
import { Search } from './Search';

export interface AppProps {
	plugIn: DoMoreThingsPlugin;
}

export const App: React.FC<AppProps> = ({ plugIn }) => {
	const [data, setData] = useState<Things3Data | undefined>();

	const linker = new DoMoreThingsNoteLinker(plugIn);
	const things = new Things3Manager();

	const state = JSON.parse(
		localStorage.getItem(THINGS3_LOCAL_STORAGE_KEY) || '{}'
	);

	const linkedNotes = linker.getAllLinkedNotes();

	const noteLinker = async (item: Things3Todo) => {
		const file = await linker.createItemNote(item);
		await linker.openItemNote(item);
		return file;
	};

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				if (isMounted) getTodaysTodos();
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		const interval = setInterval(fetchData, 30000); // poll every 30s

		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, []);

	const getTodaysTodos = async () => {
		const todos = await things.getTodayListByJXA();
		setData(JSON.parse(todos));
	}

	return (
		<AppProvider
			linkedNotes={linkedNotes}
			data={data}
			linkNote={noteLinker}
			settings={plugIn.settings}
			state={state}
			refreshData={getTodaysTodos}
		>
			<div className="do-more-things-main">
				<Header />
				<AiSuggestion />

				<Search />

				<div className="do-more-things-content">
					<Page />
				</div>

				<div>add</div>
			</div>
		</AppProvider>
	);
};
