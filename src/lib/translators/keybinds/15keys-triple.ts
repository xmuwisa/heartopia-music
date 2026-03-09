type Octave15Triple = 'middle' | 'top' | 'highest';

export const KEYS_15_TRIPLE_KEYBINDS: Record<Octave15Triple, Record<string, string>> = {
	middle: {
		C: 'Y',
		D: 'U',
		E: 'I',
		F: 'O',
		G: 'P',
		A: 'H',
		B: 'J'
	},
	top: {
		C: 'K',
		D: 'L',
		E: ';',
		F: 'N',
		G: 'M',
		A: ',',
		B: '.'
	},
	highest: {
		C: '/'
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

export const FLAT_TO_15_TRIPLE_KEY: Record<string, string> = {
	Db: 'C',
	Eb: 'E',
	Gb: 'F',
	Ab: 'G',
	Bb: 'A'
};

export const SHARP_TO_15_TRIPLE_KEY: Record<string, string> = {
	'C#': 'C',
	'D#': 'E',
	'F#': 'F',
	'G#': 'G',
	'A#': 'A'
};

export type { Octave15Triple };
