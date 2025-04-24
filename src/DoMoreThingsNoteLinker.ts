import DoMoreThingsPlugin from 'main';
import { Things3Todo } from './types';
import { TFile } from 'obsidian';

export class DoMoreThingsNoteLinker {
	constructor(private readonly _plugIn: DoMoreThingsPlugin) {}

	async ItemHasLinkedNote(item: Things3Todo) {
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
		return 'Do More Things';
	}

	getFileNameWithPath(item: Things3Todo) {
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

		await this._plugIn.app.vault.create(
			fileName,
			`#### ${item.name}

Tags: ${item.tags.map((tag) => `#${tag}`).join(' ')}
Notes: ${item.notes}
`
		);

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
