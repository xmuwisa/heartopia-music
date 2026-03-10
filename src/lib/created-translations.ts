const STORAGE_KEY = 'heartopia.createdTranslations';

export type CreatedTranslation = {
	id: string;
	title: string;
	notes: string;
	createdAt: string;
};

type SaveCreatedTranslationInput = {
	title: string;
	notes: string;
};

function createId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeReadStorage(): CreatedTranslation[] {
	if (typeof localStorage === 'undefined') return [];

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];

	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed.filter((entry): entry is CreatedTranslation => {
			return (
				typeof entry?.id === 'string' &&
				typeof entry?.title === 'string' &&
				typeof entry?.notes === 'string' &&
				typeof entry?.createdAt === 'string'
			);
		});
	} catch {
		return [];
	}
}

function writeStorage(entries: CreatedTranslation[]): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getCreatedTranslations(): CreatedTranslation[] {
	return safeReadStorage();
}

export function saveCreatedTranslation(input: SaveCreatedTranslationInput): CreatedTranslation {
	const entry: CreatedTranslation = {
		id: createId(),
		title: input.title.trim(),
		notes: input.notes,
		createdAt: new Date().toISOString()
	};

	const existing = safeReadStorage();
	writeStorage([entry, ...existing]);

	return entry;
}

export function deleteCreatedTranslation(id: string): void {
	const next = safeReadStorage().filter((entry) => entry.id !== id);
	writeStorage(next);
}

export function updateCreatedTranslation(id: string, notes: string): CreatedTranslation | null {
	const existing = safeReadStorage();
	let updatedEntry: CreatedTranslation | null = null;

	const next = existing.map((entry) => {
		if (entry.id !== id) return entry;

		updatedEntry = {
			...entry,
			notes
		};

		return updatedEntry;
	});

	if (!updatedEntry) return null;

	writeStorage(next);
	return updatedEntry;
}
