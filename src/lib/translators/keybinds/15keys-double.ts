type Octave15 = 'middle' | 'top' | 'highest';

export const KEYS_15_KEYBINDS: Record<Octave15, Record<string, string>> = {
	middle: {
		C: 'A',
		D: 'S',
		E: 'D',
		F: 'F',
		G: 'G',
		A: 'H',
		B: 'J'
	},
	top: {
		C: 'Q',
		D: 'W',
		E: 'E',
		F: 'R',
		G: 'T',
		A: 'Y',
		B: 'U'
	},
	highest: {
		C: 'I'
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

export const FLAT_TO_15_KEY: Record<string, string> = {
	Db: 'C',
	Eb: 'E',
	Gb: 'F',
	Ab: 'G',
	Bb: 'A'
};

export const SHARP_TO_15_KEY: Record<string, string> = {
	'C#': 'C',
	'D#': 'E',
	'F#': 'F',
	'G#': 'G',
	'A#': 'A'
};

export type { Octave15 };
