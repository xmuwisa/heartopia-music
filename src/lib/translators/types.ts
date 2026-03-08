import type { Instrument } from '$lib/instruments';

export type TranslateOptions = {
	showSolfege?: boolean;
};

export type InstrumentTranslator = {
	instrument: Instrument;
	exportTitle: string;
	translate: (input: string, options?: TranslateOptions) => string;
};
