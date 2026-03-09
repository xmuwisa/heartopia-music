export type TranslateOptions = {
	showSolfege?: boolean;
};

export type InstrumentTranslator = {
	exportTitle: string;
	translate: (input: string, options?: TranslateOptions) => string;
};
