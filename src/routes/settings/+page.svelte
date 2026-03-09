<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AVAILABLE_THEMES,
		DEFAULT_THEME,
		type Theme,
		initializeTheme,
		setTheme
	} from '$lib/theme';

	let selectedTheme: Theme = DEFAULT_THEME;

	onMount(() => {
		selectedTheme = initializeTheme();
	});

	function handleThemeChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		const theme = target.value as Theme;

		selectedTheme = theme;
		setTheme(theme);
	}
</script>

<section class="flex min-h-screen w-full flex-col items-center justify-start">
	<div class="flex h-full w-full max-w-xl flex-col items-center justify-center gap-4 p-8">
		<h1 class="title mb-4 text-center text-5xl font-bold text-primary sm:text-7xl">SETTINGS</h1>
		<div class="w-full rounded-xl p-2">
			<label class="form-control w-full">
				<div class="mb-1">
					<span class="text-base-content/50">Theme</span>
				</div>
				<select
					class="select-bordered select w-full"
					value={selectedTheme}
					on:change={handleThemeChange}
				>
					{#each AVAILABLE_THEMES as theme}
						<option value={theme}>{theme}</option>
					{/each}
				</select>
			</label>
		</div>
	</div>
</section>
