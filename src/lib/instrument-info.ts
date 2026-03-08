import type { Instrument } from '$lib/instruments';

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

export const INSTRUMENT_INFO_MAP: Record<Instrument, InstrumentInfo> = {
	Piano: {
		status: 'ready',
		title: 'PIANO INPUT GUIDE',
		description: 'Formatting rules for the 22-key piano',
		table: [
			{
				category: 'Notes',
				example: 'C D E F G A B / DO RE MI FA SOL LA SI',
				description: 'You can use standard letter notes or solfege names. Input is case-sensitive.'
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
	Violin: {
		status: 'in-progress',
		title: 'IN PROGRESS',
		description: 'Violin conversion guide is in progress.',
		table: []
	},
	Lute: {
		status: 'in-progress',
		title: 'IN PROGRESS',
		description: 'Lute conversion guide is in progress.',
		table: []
	},
	Lyre: {
		status: 'in-progress',
		title: 'IN PROGRESS',
		description: 'Lyre conversion guide is in progress.',
		table: []
	},
	Cello: {
		status: 'in-progress',
		title: 'IN PROGRESS',
		description: 'Cello conversion guide is in progress.',
		table: []
	},
	Guitar: {
		status: 'in-progress',
		title: 'IN PROGRESS',
		description: 'Guitar conversion guide is in progress.',
		table: []
	}
};
