import type { KeySetting } from '$lib/translators';

const STORAGE_KEY = 'heartopia.savedTranslations';

export type SavedTranslation = {
	id: string;
	title: string;
	keySetting: KeySetting;
	inputNotes: string;
	outputNotes: string;
	showSolfege: boolean;
	createdAt: string;
};

type SaveTranslationInput = {
	title: string;
	keySetting: KeySetting;
	inputNotes: string;
	outputNotes: string;
	showSolfege: boolean;
};

function createId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeReadStorage(): SavedTranslation[] {
	if (typeof localStorage === 'undefined') return [];

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];

	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed.filter((entry): entry is SavedTranslation => {
			return (
				typeof entry?.id === 'string' &&
				typeof entry?.title === 'string' &&
				typeof entry?.keySetting === 'string' &&
				typeof entry?.inputNotes === 'string' &&
				typeof entry?.outputNotes === 'string' &&
				typeof entry?.showSolfege === 'boolean' &&
				typeof entry?.createdAt === 'string'
			);
		});
	} catch {
		return [];
	}
}

function writeStorage(entries: SavedTranslation[]): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getSavedTranslations(): SavedTranslation[] {
	return safeReadStorage();
}

export function saveTranslation(input: SaveTranslationInput): SavedTranslation {
	const entry: SavedTranslation = {
		id: createId(),
		title: input.title.trim(),
		keySetting: input.keySetting,
		inputNotes: input.inputNotes,
		outputNotes: input.outputNotes,
		showSolfege: input.showSolfege,
		createdAt: new Date().toISOString()
	};

	const existing = safeReadStorage();
	writeStorage([entry, ...existing]);

	return entry;
}

export function deleteSavedTranslation(id: string): void {
	const next = safeReadStorage().filter((entry) => entry.id !== id);
	writeStorage(next);
}
