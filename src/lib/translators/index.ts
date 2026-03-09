import { keys22Translator } from '$lib/translators/22keys';
import type { InstrumentTranslator } from '$lib/translators/types';

export const KEY_SETTINGS = ['22-Keys', '15 Keys (Double Row)', '15 Keys (Triple Row)'] as const;

export type KeySetting = (typeof KEY_SETTINGS)[number];

function createLayoutTranslator(keySetting: KeySetting): InstrumentTranslator {
	return {
		exportTitle: `Heartopia ${keySetting} Keybinds`,
		translate: (input) => input
	};
}

const TRANSLATORS: Record<KeySetting, InstrumentTranslator> = {
	'22-Keys': keys22Translator,
	'15 Keys (Double Row)': createLayoutTranslator('15 Keys (Double Row)'),
	'15 Keys (Triple Row)': createLayoutTranslator('15 Keys (Triple Row)')
};

export function getKeySettingTranslator(keySetting: KeySetting): InstrumentTranslator {
	return TRANSLATORS[keySetting];
}

export { TRANSLATORS };
export type { InstrumentTranslator } from '$lib/translators/types';
