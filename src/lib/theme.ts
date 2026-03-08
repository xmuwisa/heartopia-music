import { browser } from '$app/environment';

export const THEME_STORAGE_KEY = 'heartopia-theme';

export const AVAILABLE_THEMES = ['valentine', 'black', 'pastel', 'night'] as const;
export type Theme = (typeof AVAILABLE_THEMES)[number];

export const DEFAULT_THEME: Theme = 'pastel';

function isTheme(value: string): value is Theme {
	return (AVAILABLE_THEMES as readonly string[]).includes(value);
}

export function getStoredTheme(): Theme | null {
	if (!browser) return null;

	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	return stored && isTheme(stored) ? stored : null;
}

export function getInitialTheme(): Theme {
	return getStoredTheme() ?? DEFAULT_THEME;
}

export function applyTheme(theme: Theme): void {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', theme);
}

export function initializeTheme(): Theme {
	const theme = getInitialTheme();
	applyTheme(theme);
	return theme;
}

export function setTheme(theme: Theme): void {
	if (!browser) return;
	localStorage.setItem(THEME_STORAGE_KEY, theme);
	applyTheme(theme);
}
