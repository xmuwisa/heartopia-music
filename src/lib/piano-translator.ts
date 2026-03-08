type Octave = 'top' | 'middle' | 'bottom';

type ParsedNote = {
	note: string;
	octave: Octave;
};

type TranslationWithSolfege = {
	solfege: string;
	keybind: string;
};

type TranslatePianoNotesOptions = {
	showSolfege?: boolean;
};

const KEYBINDS: Record<Octave, Record<string, string>> = {
	top: {
		C: 'Q',
		D: 'W',
		E: 'E',
		F: 'R',
		G: 'T',
		A: 'Y',
		B: 'U',
		'C#': '2',
		'D#': '3',
		'F#': '5',
		'G#': '6',
		'A#': '7'
	},
	middle: {
		C: 'Z',
		D: 'X',
		E: 'C',
		F: 'V',
		G: 'B',
		A: 'N',
		B: 'M',
		'C#': 'S',
		'D#': 'D',
		'F#': 'G',
		'G#': 'H',
		'A#': 'J'
	},
	bottom: {
		C: ',',
		D: '.',
		E: '/',
		F: 'O',
		G: 'P',
		A: '[',
		B: ']',
		'C#': 'L',
		'D#': ';',
		'F#': '0',
		'G#': '-',
		'A#': '='
	}
};

const SOLFEGE_MAP: Record<string, string> = {
	DO: 'C',
	RE: 'D',
	MI: 'E',
	FA: 'F',
	SOL: 'G',
	LA: 'A',
	SI: 'B'
};

const FLAT_TO_SHARP: Record<string, string> = {
	Db: 'C#',
	Eb: 'D#',
	Gb: 'F#',
	Ab: 'G#',
	Bb: 'A#'
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
	return KEYBINDS[octave][note] ?? null;
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

export function translatePianoNotes(
	input: string,
	options: TranslatePianoNotesOptions = {}
): string {
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

export {
	parseNote,
	isNoteLine,
	getKeybind,
	getSolfegeName,
	translateLine,
	translateLineWithSolfege
};
