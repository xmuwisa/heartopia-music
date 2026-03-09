import {
	FLAT_TO_SHARP,
	KEYS_22_KEYBINDS,
	SOLFEGE_MAP,
	type Octave
} from '$lib/translators/keybinds/22keys';
import type { InstrumentTranslator, TranslateOptions } from '$lib/translators/types';

type ParsedNote = {
	note: string;
	octave: Octave;
};

type TranslationWithSolfege = {
	solfege: string;
	keybind: string;
};

function normalizeSolfege(token: string): string | null {
	const upper = token.toUpperCase();
	for (const solfege of Object.keys(SOLFEGE_MAP)) {
		if (upper === solfege) {
			return SOLFEGE_MAP[solfege];
		}
	}

	return null;
}

function parseNote(token: string): ParsedNote | null {
	const strippedToken = token.replace(/[()]/g, '');
	if (!strippedToken) return null;

	let octave: Octave = 'middle';
	let noteStr = strippedToken;

	if (strippedToken.startsWith('^')) {
		octave = 'top';
		noteStr = strippedToken.substring(1);
	} else if (strippedToken.startsWith('.')) {
		octave = 'bottom';
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
			const flatKey = `${note}b`;
			note = FLAT_TO_SHARP[flatKey] ?? note;
		} else if (accidental === '#') {
			note = `${note}#`;
		}
	}

	return { note, octave };
}

function getKeybind(parsedNote: ParsedNote | null): string | null {
	if (!parsedNote) return null;
	const { note, octave } = parsedNote;
	return KEYS_22_KEYBINDS[octave][note] ?? null;
}

function getSolfegeName(parsedNote: ParsedNote | null): string | null {
	if (!parsedNote) return null;

	const { note, octave } = parsedNote;
	let baseName = '';

	for (const [solfege, mappedNote] of Object.entries(SOLFEGE_MAP)) {
		if (mappedNote === note.replace('#', '')) {
			baseName = solfege;
			break;
		}
	}

	if (!baseName) return null;

	let result = baseName;
	if (note.includes('#')) result += '#';
	if (octave === 'top') result = `^${result}`;
	if (octave === 'bottom') result = `.${result}`;

	return result;
}

function isNoteLine(line: string): boolean {
	const tokens = line.split(/[\s-]+/);

	for (let token of tokens) {
		token = token.trim();
		if (!token) continue;

		token = token.replace(/[()]/g, '');
		if (token.startsWith('^') || token.startsWith('.')) {
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

export function translate22KeysNotes(input: string, options: TranslateOptions = {}): string {
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

export const keys22Translator: InstrumentTranslator = {
	exportTitle: 'Heartopia 22-Keys Keybinds',
	translate: (input, options = {}) => translate22KeysNotes(input, options)
};
