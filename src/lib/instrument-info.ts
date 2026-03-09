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

export const INSTRUMENT_INFO_MAP: Record<KeySetting, InstrumentInfo> = {
	'22-Keys': {
		status: 'ready',
		title: '22-KEYS INPUT GUIDE',
		description: 'Formatting rules for the 22-key layout',
		table: [
			{
				category: 'Notes',
				example: 'C D E F G A B / DO RE MI FA SOL LA SI',
				description: 'Standard letter notes or solfege names.'
			},
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
				description: 'Add # after a note to make it sharp.'
			},
			{
				category: 'Flats',
				example: 'Bb Eb',
				description: 'Add b after a note to make it flat.'
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
		]
	},
	'15 Keys (Double Row)': {
		status: 'in-progress',
		title: 'IN PROGRESS',
		description: '15 Keys (Double Row) guide is in progress.',
		table: []
	},
	'15 Keys (Triple Row)': {
		status: 'in-progress',
		title: 'IN PROGRESS',
		description: '15 Keys (Triple Row) guide is in progress.',
		table: []
	}
};
