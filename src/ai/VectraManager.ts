import { Vectra } from 'vectra';
import fs from 'fs/promises';

export class VectraManager {
	constructor(options = {}) {
		this.filePath = options.filePath || './embeddings.json';
		this.vectors = new Vectra();
	}

	// Load embeddings from disk
	async load() {
		try {
			const data = await fs.readFile(this.filePath, 'utf-8');
			const items = JSON.parse(data);
			for (const item of items) {
				this.vectors.add(item);
			}
			console.log(`[VectraManager] Loaded ${items.length} embeddings.`);
		} catch (error) {
			console.warn(
				`[VectraManager] No existing embeddings found. Starting fresh.`
			);
		}
	}

	// Save embeddings to disk
	async save() {
		try {
			const items = this.vectors.items;
			await fs.writeFile(
				this.filePath,
				JSON.stringify(items, null, 2),
				'utf-8'
			);
			console.log(`[VectraManager] Saved ${items.length} embeddings.`);
		} catch (error) {
			console.error(`[VectraManager] Failed to save embeddings:`, error);
		}
	}

	// Add a new embedding
	async add(id, vector, metadata = {}) {
		this.vectors.add({ id, vector, metadata });
		await this.save();
	}

	// Search for the top K similar embeddings
	search(queryVector, k = 3) {
		const results = this.vectors.search(queryVector, { k });
		return results;
	}

	// Clear all vectors
	async clear() {
		this.vectors = new Vectra();
		await this.save();
		console.log('[VectraManager] Cleared all embeddings.');
	}
}
