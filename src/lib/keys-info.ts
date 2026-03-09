import type { KeySetting } from '$lib/translators';

export type InfoStatus = 'ready' | 'in-progress';

export type InfoTableRow = {
	category: string;
	example: string;
	description: string;
};

export type InstrumentInfo = {
	status: InfoStatus;
	title: string;
	description: string;
	table: InfoTableRow[];
};

const COMMON_ROWS: InfoTableRow[] = [
	{
		category: 'Notes',
		example: 'C D E F G A B / DO RE MI FA SOL LA SI',
		description: 'Standard letter notes or solfege names.'
	},
	{
		category: 'Separators',
		example: 'E-D C-C',
		description: 'Notes can be separated using spaces or hyphens.'
	},
	{
		category: 'Parentheses',
		example: '(C D E)',
		description: 'Parentheses are ignored when the input is processed.'
	},
	{
		category: 'Input',
		example: 'https://noobnotes.net/',
		description: 'You can copy notes directly from this website and paste them here.'
	}
];

export const KEYS_INFO_MAP: Record<KeySetting, InstrumentInfo> = {
	'22-Keys': {
		status: 'ready',
		title: '22-KEYS INPUT GUIDE',
		description: 'Formatting rules for the 22-key layout',
		table: [
			COMMON_ROWS[0],
			{
				category: 'Higher Octave',
				example: '^C ^D',
				description: 'Place ^ before a note to play it one octave higher.'
			},
			{
				category: 'Lower Octave',
				example: '.A .B',
				description: 'Place a dot before a note to play it one octave lower.'
			},
			{
				category: 'Sharps',
				example: 'C# F#',
				description: 'Sharps are preserved and mapped to dedicated black-key binds.'
			},
			{
				category: 'Flats',
				example: 'Bb Eb',
				description: 'Flats are converted to equivalent sharps (Bb -> A#, Eb -> D#).'
			},
			COMMON_ROWS[1],
			COMMON_ROWS[2],
			COMMON_ROWS[3]
		]
	},
	'15 Keys (Double Row)': {
		status: 'ready',
		title: '15-KEYS (DOUBLE ROW) INPUT GUIDE',
		description: 'Same note parsing as 22-Keys, but with 15-key natural-note mapping.',
		table: [
			COMMON_ROWS[0],
			{
				category: 'Rows',
				example: 'Middle: A S D F G H J | Top: Q W E R T Y U | Highest: I',
				description: 'Middle and top rows cover C-B. Highest row only has C.'
			},
			{
				category: 'Octaves',
				example: '^C (top), ^^C (highest), .A (snaps to middle)',
				description:
					'Use ^ for top and ^^ for highest. Dot-prefixed notes are accepted but treated as middle.'
			},
			{
				category: 'Accidentals',
				example: 'Bb -> A, C# -> C, F# -> F',
				description:
					'Sharps and flats are normalized to natural notes because 15-key has no black keys.'
			},
			COMMON_ROWS[1],
			COMMON_ROWS[2],
			COMMON_ROWS[3]
		]
	},
	'15 Keys (Triple Row)': {
		status: 'ready',
		title: '15-KEYS (TRIPLE ROW) INPUT GUIDE',
		description: 'Same note parsing rules as 15-key double-row, with different keyboard binds.',
		table: [
			COMMON_ROWS[0],
			{
				category: 'Rows',
				example: 'Middle: Y U I O P H J | Top: K L ; N M , . | Highest: /',
				description: "Middle and top rows cover C-B. Highest row only has C (DO'')."
			},
			{
				category: 'Octaves',
				example: '^DO ^RE ^MI | ^^DO | .LA',
				description:
					'Use ^ for top and ^^ for highest. Dot-prefixed notes are accepted but treated as middle.'
			},
			{
				category: 'Accidentals',
				example: 'Ab -> G, D# -> E, A# -> A',
				description:
					'Sharps and flats are normalized to natural notes because 15-key has no black keys.'
			},
			COMMON_ROWS[1],
			COMMON_ROWS[2],
			COMMON_ROWS[3]
		]
	}
};
