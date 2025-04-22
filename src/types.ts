export const VIEW_TYPE_THINGS3 = 'do-more-things';

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

export interface Things3PluginSettings {
	heading: string;
	showTags: boolean;
	// tagsDesign: 'Simple' | 'Things'
	showNotesIcon: boolean;
	// showTagsFilter: boolean;
	// showNotesOnHover: boolean;
	// allowPinning: boolean;
	// showSearch: boolean;
	excludeProjects: string;
}
