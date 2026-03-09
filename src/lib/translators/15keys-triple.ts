import {
	FLAT_TO_15_TRIPLE_KEY,
	KEYS_15_TRIPLE_KEYBINDS,
	SHARP_TO_15_TRIPLE_KEY,
	SOLFEGE_MAP,
	type Octave15Triple
} from '$lib/translators/keybinds/15keys-triple';
import type { InstrumentTranslator, TranslateOptions } from '$lib/translators/types';

type ParsedNote = {
	note: string;
	octave: Octave15Triple;
};

type TranslationWithSolfege = {
	solfege: string;
	keybind: string;
};

function normalizeSolfege(token: string): string | null {
	const upper = token.toUpperCase();
	for (const [solfege, note] of Object.entries(SOLFEGE_MAP)) {
		if (upper === solfege) {
			return note;
		}
	}

	return null;
}

function parseNote(token: string): ParsedNote | null {
	const strippedToken = token.replace(/[()]/g, '');
	if (!strippedToken) return null;

	let octave: Octave15Triple = 'middle';
	let noteStr = strippedToken;

	if (strippedToken.startsWith('^^')) {
		octave = 'highest';
		noteStr = strippedToken.substring(2);
	} else if (strippedToken.startsWith('^')) {
		octave = 'top';
		noteStr = strippedToken.substring(1);
	} else if (strippedToken.startsWith('.')) {
		octave = 'middle';
		noteStr = strippedToken.substring(1);
	}

	noteStr = noteStr.replace(/[,;:!?]+$/g, '');
	if (!noteStr) return null;

	let note = normalizeSolfege(noteStr);
	if (!note) {
		const noteMatch = noteStr.match(/^([A-Ga-g])([#b]?)$/);
		if (!noteMatch) {
			return null;
		}

		note = noteMatch[1].toUpperCase();
		const accidental = noteMatch[2];

		if (accidental === 'b') {
			note = FLAT_TO_15_TRIPLE_KEY[`${note}b`] ?? note;
		} else if (accidental === '#') {
			note = SHARP_TO_15_TRIPLE_KEY[`${note}#`] ?? note;
		}
	}

	if (!KEYS_15_TRIPLE_KEYBINDS[octave][note]) {
		if (octave === 'highest') {
			octave = 'top';
		}
		if (!KEYS_15_TRIPLE_KEYBINDS[octave][note]) {
			octave = 'middle';
		}
	}

	return { note, octave };
}

function getKeybind(parsedNote: ParsedNote | null): string | null {
	if (!parsedNote) return null;
	const { note, octave } = parsedNote;
	return KEYS_15_TRIPLE_KEYBINDS[octave][note] ?? null;
}

function getSolfegeName(parsedNote: ParsedNote | null): string | null {
	if (!parsedNote) return null;

	const { note, octave } = parsedNote;
	let baseName = '';

	for (const [solfege, mappedNote] of Object.entries(SOLFEGE_MAP)) {
		if (mappedNote === note) {
			baseName = solfege;
			break;
		}
	}

	if (!baseName) return null;
	if (octave === 'top') return `^${baseName}`;
	if (octave === 'highest') return `^^${baseName}`;

	return baseName;
}

function isNoteLine(line: string): boolean {
	const tokens = line.split(/[\s-]+/);

	for (let token of tokens) {
		token = token.trim();
		if (!token) continue;

		token = token.replace(/[()]/g, '');
		if (token.startsWith('^^')) {
			token = token.substring(2);
		} else if (token.startsWith('^') || token.startsWith('.')) {
			token = token.substring(1);
		}

		token = token.replace(/[,;:!?]+$/g, '');
		if (!token) continue;

		if (normalizeSolfege(token)) return true;
		if (/^[A-Ga-g][#b]?$/.test(token)) return true;
	}

	return false;
}

function translateLine(line: string): string {
	const parts = line.split(/\s+/);
	const translatedParts: string[] = [];

	for (const part of parts) {
		if (!part.trim()) continue;

		if (part.includes('-')) {
			const subTokens = part.split('-');
			const translatedSubTokens: string[] = [];

			for (let subToken of subTokens) {
				subToken = subToken.trim();
				if (!subToken) {
					translatedSubTokens.push('');
					continue;
				}

				const parsed = parseNote(subToken);
				const keybind = getKeybind(parsed);
				translatedSubTokens.push(keybind ?? subToken);
			}

			translatedParts.push(translatedSubTokens.join('-'));
		} else {
			const parsed = parseNote(part);
			const keybind = getKeybind(parsed);
			translatedParts.push(keybind ?? part);
		}
	}

	return translatedParts.join(' ');
}

function translateLineWithSolfege(line: string): TranslationWithSolfege {
	const parts = line.split(/\s+/);
	const solfegeParts: string[] = [];
	const keybindParts: string[] = [];

	for (const part of parts) {
		if (!part.trim()) continue;

		if (part.includes('-')) {
			const subTokens = part.split('-');
			const solfegeSubTokens: string[] = [];
			const keybindSubTokens: string[] = [];

			for (let subToken of subTokens) {
				subToken = subToken.trim();
				if (!subToken) {
					solfegeSubTokens.push('');
					keybindSubTokens.push('');
					continue;
				}

				const parsed = parseNote(subToken);
				const solfege = getSolfegeName(parsed);
				const keybind = getKeybind(parsed);

				solfegeSubTokens.push(solfege ?? subToken);
				keybindSubTokens.push(keybind ?? subToken);
			}

			solfegeParts.push(solfegeSubTokens.join('-'));
			keybindParts.push(keybindSubTokens.join('-'));
		} else {
			const parsed = parseNote(part);
			const solfege = getSolfegeName(parsed);
			const keybind = getKeybind(parsed);

			solfegeParts.push(solfege ?? part);
			keybindParts.push(keybind ?? part);
		}
	}

	return {
		solfege: solfegeParts.join(' '),
		keybind: keybindParts.join(' ')
	};
}

export function translate15KeysTripleNotes(input: string, options: TranslateOptions = {}): string {
	const { showSolfege = false } = options;
	const lines = input.split('\n');
	const outputLines: string[] = [];

	for (const line of lines) {
		if (!line.trim()) {
			outputLines.push('');
			continue;
		}

		if (!isNoteLine(line)) {
			outputLines.push(line);
			continue;
		}

		if (showSolfege) {
			const translated = translateLineWithSolfege(line);
			outputLines.push(translated.solfege);
			outputLines.push(translated.keybind);
			continue;
		}

		outputLines.push(translateLine(line));
	}

	return outputLines.join('\n');
}

export const keys15TripleTranslator: InstrumentTranslator = {
	exportTitle: 'Heartopia 15 Keys (Triple Row) Keybinds',
	translate: (input, options = {}) => translate15KeysTripleNotes(input, options)
};
