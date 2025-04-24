export const VIEW_TYPE_THINGS3 = 'do-more-things';
export const THINGS3_LOCAL_STORAGE_KEY = 'do-more-things-state';

export type Things3Data = {
	groups: string[];
	tags: string[];
} & {
	[key: string]: Things3Todo[];
};

export type Things3Todo = {
	id: string;
	status: 'open' | 'completed';
	tags: string[];
	name: string;
	notes: string;
	area: string;
	project: string;
	dueDate: string;
	hasNotes: boolean;
};

export interface DoMoreThingsPluginSetting {
	heading: string;
	showTags: boolean;
	showNotesIcon: boolean;
	showExpandIcon: boolean;

	// linked notes
	allowLinkedNotes: boolean;
	linkedNoteNamingSystem: 'id' | 'name';
	linkedNoteFolderName: string;
}

export type CallBackType = (event: 'refresh' | 'checkbox', e: Event) => void;
