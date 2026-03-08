<script lang="ts">
	import InstrumentInfoPopup from '$lib/components/InstrumentInfoPopup.svelte';
	import { getInstrumentTranslator } from '$lib/translators';
	import type { InstrumentTranslator } from '$lib/translators';
	import type { Instrument } from '$lib/instruments';
	import { Icon, Clipboard, ArrowDownTray } from 'svelte-hero-icons';

	export let instrument: Instrument;

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

	async function downloadOutput(): Promise<void> {
		if (!outputNotes.trim()) return;

		const { jsPDF } = await import('jspdf');
		const doc = new jsPDF({ unit: 'mm', format: 'a4' });

		doc.setFont('helvetica', 'bold');
		doc.setFontSize(16);
		doc.text(translator.exportTitle, 105, 15, { align: 'center' });

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8);
		doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });

		doc.setFont('courier', 'normal');
		doc.setFontSize(10);

		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 15;
		const lineHeight = 5;
		const maxWidth = 180;
		let y = 30;

		for (const rawLine of outputNotes.split('\n')) {
			const wrapped = doc.splitTextToSize(rawLine || ' ', maxWidth) as string[];

			for (const line of wrapped) {
				if (y > pageHeight - margin) {
					doc.addPage();
					y = margin;
				}

				doc.text(line, margin, y);
				y += lineHeight;
			}
		}

		doc.save(`heartopia-keybinds-${new Date().toISOString().slice(0, 10)}.pdf`);
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
					onclick={downloadOutput}
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
