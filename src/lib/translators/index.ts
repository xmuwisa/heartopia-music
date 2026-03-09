import { pianoTranslator } from '$lib/translators/piano';
import type { InstrumentTranslator } from '$lib/translators/types';

export const INSTRUMENTS = ['Piano', 'Violin', 'Lute', 'Lyre', 'Cello', 'Guitar'] as const;

export type Instrument = (typeof INSTRUMENTS)[number];

function createFallbackTranslator(instrument: Instrument): InstrumentTranslator {
	return {
		exportTitle: `Heartopia ${instrument} Keybinds`,
		translate: (input) => input
	};
}

const TRANSLATORS: Record<Instrument, InstrumentTranslator> = {
	Piano: pianoTranslator,
	Violin: createFallbackTranslator('Violin'),
	Lute: createFallbackTranslator('Lute'),
	Lyre: createFallbackTranslator('Lyre'),
	Cello: createFallbackTranslator('Cello'),
	Guitar: createFallbackTranslator('Guitar')
};

export function getInstrumentTranslator(instrument: Instrument): InstrumentTranslator {
	return TRANSLATORS[instrument];
}

export { TRANSLATORS };
export type { InstrumentTranslator } from '$lib/translators/types';
