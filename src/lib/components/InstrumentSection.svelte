<script lang="ts">
	import InstrumentInfoPopup from '$lib/components/InstrumentInfoPopup.svelte';
	import type { Instrument } from '$lib/instruments';
	import { Icon, Clipboard, ArrowDownTray } from 'svelte-hero-icons';

	export let instrument: Instrument;
</script>

<section class="relative w-full lg:p-0">
	{#if instrument === 'Piano'}
		<div class="absolute right-0 -bottom-10 lg:top-2 lg:-right-10">
			<div class="flex flex-row items-start lg:flex-col">
				<InstrumentInfoPopup {instrument} />
				<div class="tooltip tooltip-bottom lg:tooltip-right" data-tip="Download">
					<button type="button" class="btn btn-square btn-ghost btn-sm" aria-label="Download">
						<Icon src={ArrowDownTray} class="h-5 w-5" />
					</button>
				</div>
				<div class="tooltip tooltip-bottom lg:tooltip-right" data-tip="Copy">
					<button type="button" class="btn btn-square btn-ghost btn-sm" aria-label="Copy">
						<Icon src={Clipboard} class="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>

		<div class="mt-3 space-y-4">
			<div class="form-control w-full">
				<label for="input" class="label">
					<span class="label-text font-medium">Your note guide</span>
				</label>
				<textarea
					id="input"
					class="textarea-bordered textarea h-60 w-full resize-y font-mono leading-relaxed"
					placeholder={`.Bb  C     C#    D#     F-Bb    G#    F     F
I was scared of dentists and the dark

.Bb  C    C#   D#   F-Bb   G#
I was scared of pretty girls

D#      F-D#     F-D#-F-G#
And starting conversations...`}
				></textarea>
			</div>

			<div class="form-control w-full">
				<label for="output" class="label">
					<span class="label-text font-medium">Heartopia Keybinds</span>
				</label>
				<textarea
					id="output"
					readonly
					class="textarea-bordered textarea-disabled textarea h-60 w-full resize-y font-mono leading-relaxed"
					placeholder="Translated keybinds will appear here..."
				></textarea>
			</div>

			<div class="flex w-full flex-row gap-1">
				<button class="btn flex-1 btn-primary" disabled> Translate </button>
				<button class="btn flex-1 btn-warning" disabled> Clear </button>
			</div>
		</div>
	{:else}
		<p>IN PROGRESS</p>
	{/if}
</section>
