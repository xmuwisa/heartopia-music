<script lang="ts">
	import InstrumentDownloadPopup from '$lib/components/InstrumentDownloadPopup.svelte';
	import InstrumentInfoPopup from '$lib/components/InstrumentInfoPopup.svelte';
	import { downloadInstrumentPdf } from '$lib/pdf/download-instrument-pdf';
	import { getInstrumentTranslator } from '$lib/translators';
	import type { InstrumentTranslator } from '$lib/translators';
	import type { Instrument } from '$lib/translators';
	import { Icon, Clipboard, ArrowDownTray } from 'svelte-hero-icons';

	export let instrument: Instrument;

	let downloadPopup: { open: () => void } | null = null;
	let inputNotes = '';
	let outputNotes = '';
	let showSolfege = false;
	let autoPreviewEnabled = false;
	let translator: InstrumentTranslator;

	$: translator = getInstrumentTranslator(instrument);

	$: if (autoPreviewEnabled) {
		outputNotes = inputNotes.trim() ? translator.translate(inputNotes, { showSolfege }) : '';
	}

	function translateNotes(): void {
		autoPreviewEnabled = true;
		outputNotes = translator.translate(inputNotes, { showSolfege });
	}

	function clearNotes(): void {
		autoPreviewEnabled = false;
		inputNotes = '';
		outputNotes = '';
		showSolfege = false;
	}

	async function copyOutput(): Promise<void> {
		if (!outputNotes.trim()) return;

		try {
			await navigator.clipboard.writeText(outputNotes);
		} catch {
			const fallback = document.createElement('textarea');
			fallback.value = outputNotes;
			document.body.appendChild(fallback);
			fallback.select();
			document.execCommand('copy');
			document.body.removeChild(fallback);
		}
	}

	async function generatePdf(songTitle: string): Promise<void> {
		await downloadInstrumentPdf({
			songTitle,
			instrument,
			outputNotes
		});
	}

	async function handleDownloadConfirm(event: CustomEvent<string>): Promise<void> {
		await generatePdf(event.detail);
	}

	function handleInputKeydown(event: KeyboardEvent): void {
		if (event.ctrlKey && event.key === 'Enter') {
			translateNotes();
		}
	}
</script>

<section class="relative w-full lg:p-0">
	<div class="absolute right-0 -bottom-10 lg:top-2 lg:-right-10">
		<div class="flex flex-row items-start lg:flex-col">
			<InstrumentInfoPopup {instrument} />
			<div class="tooltip tooltip-bottom lg:tooltip-right" data-tip="Download">
				<button
					type="button"
					class="btn btn-square btn-ghost btn-sm"
					aria-label="Download"
					onclick={() => downloadPopup?.open()}
					disabled={!outputNotes.trim()}
				>
					<Icon src={ArrowDownTray} class="h-5 w-5" />
				</button>
			</div>
			<div class="tooltip tooltip-bottom lg:tooltip-right" data-tip="Copy">
				<button
					type="button"
					class="btn btn-square btn-ghost btn-sm"
					aria-label="Copy"
					onclick={copyOutput}
					disabled={!outputNotes.trim()}
				>
					<Icon src={Clipboard} class="h-5 w-5" />
				</button>
			</div>
			<div class="tooltip tooltip-bottom lg:tooltip-right" data-tip="Show solfege">
				<label class="btn btn-square cursor-pointer btn-ghost btn-sm" aria-label="Show solfege">
					<input type="checkbox" class="checkbox checkbox-sm" bind:checked={showSolfege} />
				</label>
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
				bind:value={inputNotes}
				onkeydown={handleInputKeydown}
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
				bind:value={outputNotes}
				placeholder="Translated keybinds will appear here..."
			></textarea>
		</div>

		<div class="flex w-full flex-row gap-1">
			<button class="btn flex-1 btn-primary" onclick={translateNotes} disabled={!inputNotes.trim()}>
				Translate
			</button>
			<button class="btn flex-1 btn-warning" onclick={clearNotes} disabled={!inputNotes.trim()}>
				Clear
			</button>
		</div>
	</div>
</section>

<InstrumentDownloadPopup
	bind:this={downloadPopup}
	on:confirm={(event) => void handleDownloadConfirm(event)}
/>
