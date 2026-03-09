import { keys22Translator } from '$lib/translators/22keys';
import { keys15DoubleTranslator } from '$lib/translators/15keys-double';
import { keys15TripleTranslator } from '$lib/translators/15keys-triple';
import type { InstrumentTranslator } from '$lib/translators/types';

export const KEY_SETTINGS = ['22-Keys', '15 Keys (Double Row)', '15 Keys (Triple Row)'] as const;

export type KeySetting = (typeof KEY_SETTINGS)[number];

const TRANSLATORS: Record<KeySetting, InstrumentTranslator> = {
	'22-Keys': keys22Translator,
	'15 Keys (Double Row)': keys15DoubleTranslator,
	'15 Keys (Triple Row)': keys15TripleTranslator
};

export function getKeySettingTranslator(keySetting: KeySetting): InstrumentTranslator {
	return TRANSLATORS[keySetting];
}

export { TRANSLATORS };
export type { InstrumentTranslator } from '$lib/translators/types';
