import type { Instrument } from '$lib/instruments';
import { pianoTranslator } from '$lib/translators/piano';
import type { InstrumentTranslator } from '$lib/translators/types';

function createFallbackTranslator(instrument: Instrument): InstrumentTranslator {
	return {
		instrument,
		exportTitle: `Heartopia ${instrument} Keybinds`,
		translate: (input) => input
	};
}

const TRANSLATORS: Partial<Record<Instrument, InstrumentTranslator>> = {
	Piano: pianoTranslator
};

export function getInstrumentTranslator(instrument: Instrument): InstrumentTranslator {
	return TRANSLATORS[instrument] ?? createFallbackTranslator(instrument);
}

export { TRANSLATORS };
export type { InstrumentTranslator } from '$lib/translators/types';
