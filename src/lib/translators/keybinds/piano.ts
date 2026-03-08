type Octave = 'top' | 'middle' | 'bottom';

export const PIANO_KEYBINDS: Record<Octave, Record<string, string>> = {
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

export const SOLFEGE_MAP: Record<string, string> = {
	DO: 'C',
	RE: 'D',
	MI: 'E',
	FA: 'F',
	SOL: 'G',
	LA: 'A',
	SI: 'B'
};

export const FLAT_TO_SHARP: Record<string, string> = {
	Db: 'C#',
	Eb: 'D#',
	Gb: 'F#',
	Ab: 'G#',
	Bb: 'A#'
};

export type { Octave };
