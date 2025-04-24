import DoMoreThingsPlugin from 'main';
import { DoMoreThingsPluginSetting, Things3Todo } from './types';
import { TFile } from 'obsidian';

export class DoMoreThingsNoteLinker {
	private _settings: DoMoreThingsPluginSetting;

	constructor(private readonly _plugIn: DoMoreThingsPlugin) {
		this._settings = this._plugIn.settings;
	}

	async itemHasLinkedNote(item: Things3Todo) {
		const file = await this._plugIn.app.vault.getAbstractFileByPath(
			this.getFileNameWithPath(item)
		);
		if (file) {
			return true;
		} else {
			return false;
		}
	}

	getFolderName() {
		const { linkedNoteFolderName } = this._settings;

		if (linkedNoteFolderName) {
			return linkedNoteFolderName;
		}

		return 'Do More Things';
	}

	getFileNameWithPath(item: Things3Todo) {
		const { linkedNoteNamingSystem } = this._settings;

		if (linkedNoteNamingSystem === 'name') {
			const fileName = item.name.replace(/[^a-zA-Z0-9]/g, ' ');
			return `${this.getFolderName()}/${fileName}.md`;
		}
		if (linkedNoteNamingSystem === 'id') {
			return `${this.getFolderName()}/${item.id}.md`;
		}

		return `${this.getFolderName()}/${item.id}.md`;
	}

	ensureNoteFolderExists() {
		const folderPath = this.getFolderName();
		if (!this._plugIn.app.vault.getAbstractFileByPath(folderPath)) {
			this._plugIn.app.vault.createFolder(folderPath);
		}
	}

	async createItemNote(item: Things3Todo) {
		this.ensureNoteFolderExists();

		const fileName = this.getFileNameWithPath(item);

		if (!(await this.itemHasLinkedNote(item))) {
			await this._plugIn.app.vault.create(
				fileName,
				`#### ${item.name}

Tags: #DoMoreThings ${item.tags.map((tag) => `#${tag}`).join(' ')}
Notes: ${item.notes}
`
			);
		}

		return fileName;
	}

	async openItemNote(item: Things3Todo) {
		const file = await this._plugIn.app.vault.getAbstractFileByPath(
			this.getFileNameWithPath(item)
		);
		if (file && file instanceof TFile) {
			await this._plugIn.app.workspace.getLeaf().openFile(file);
		}
	}

	public getAllLinkedNotes() {
		const notes = this._plugIn.app.vault.getMarkdownFiles();
		const linkedNotes = notes.filter((note) => {
			return note.path.startsWith(`${this.getFolderName()}/`);
		});
		return linkedNotes.map((note) => ({
			id: note.basename.replace(`.${note.extension}`, ''),
			extension: note.extension,
			name: note.basename,
			path: note.path,
		}));
	}
}
