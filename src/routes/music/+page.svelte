<script lang="ts">
	import InstrumentSection from '$lib/components/InstrumentSection.svelte';
	import noobnoteSample from '$lib/assets/noobnote-sample.png';
	import { KEY_SETTINGS, type KeySetting } from '$lib/translators';

	let selectedKeySetting: KeySetting = KEY_SETTINGS[0];
	let noobnoteDialogEl: HTMLDialogElement;

	$: needsNoobnoteDisclaimer =
		selectedKeySetting === '15 Keys (Double Row)' || selectedKeySetting === '15 Keys (Triple Row)';

	const openNoobnoteSampleDialog = (): void => {
		noobnoteDialogEl?.showModal();
	};
</script>

<section class="flex min-h-screen w-full flex-col items-center justify-start">
	<div class="flex h-full w-full max-w-xl flex-col items-center justify-center gap-8 p-8">
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="title text-center text-4xl leading-none font-bold text-primary">
				MUSIC NOTE TRANSLATOR
			</h1>
			<div>
				<label class="form-control w-full">
					<select class="select-bordered select w-full" bind:value={selectedKeySetting}>
						{#each KEY_SETTINGS as keySetting}
							<option value={keySetting}>{keySetting}</option>
						{/each}
					</select>
				</label>
			</div>
			<div class="flex w-full items-center justify-center">
				{#if needsNoobnoteDisclaimer}
					<p class="mt-3 max-w-xl text-center text-xs leading-relaxed text-base-content/50">
						Due to 15-key layout limitations (including missing semitones), some songs may sound
						off. If you are using NoobNotes (or similar sources), use the Shift Key Up/Down feature
						to move the song into C Major first before copying notes for translation here.
						<button type="button" class="ml-1 link link-primary" onclick={openNoobnoteSampleDialog}>
							Here is a sample.
						</button>
					</p>
				{/if}
			</div>
		</div>

		<InstrumentSection keySetting={selectedKeySetting} />
	</div>
</section>

<dialog bind:this={noobnoteDialogEl} class="modal">
	<div class="modal-box max-w-3xl">
		<h3 class="text-lg font-bold">Example using NoobNotes</h3>
		<p class="py-2 text-sm text-base-content/80">
			This is a sample shift key feature of NoobNotes. If using other sources, try to make your
			songs on C Major before copying notes here and see if it sounds better.
		</p>
		<img
			src={noobnoteSample}
			alt="NoobNotes sample showing Shift Key Up/Down before copying notes"
			class="h-auto w-full rounded-lg border border-base-300"
		/>

		<div class="modal-action">
			<button type="button" class="btn" onclick={() => noobnoteDialogEl.close()}>Close</button>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button aria-label="Close popup">close</button>
	</form>
</dialog>
