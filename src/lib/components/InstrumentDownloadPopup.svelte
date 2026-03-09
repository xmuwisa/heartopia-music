<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ confirm: string }>();

	let dialogEl: HTMLDialogElement;
	let songTitleInput = '';
	let songTitleError = '';

	export function open(): void {
		songTitleInput = '';
		songTitleError = '';
		dialogEl?.showModal();
	}

	function closeDialog(): void {
		dialogEl?.close();
	}

	function confirmDownload(): void {
		const songTitle = songTitleInput.trim();
		if (!songTitle) {
			songTitleError = 'Song title is required.';
			return;
		}

		songTitleError = '';
		dispatch('confirm', songTitle);
		closeDialog();
	}
</script>

<dialog bind:this={dialogEl} class="modal">
	<div class="modal-box">
		<h3 class="title text-center text-3xl text-primary">ENTER SONG TITLE</h3>
		<p class="mt-1 text-center text-sm opacity-70">This is required before downloading the PDF.</p>

		<div class="form-control mt-4">
			<label for="song-title-input" class="label">
				<span class="label-text font-medium">Song title</span>
			</label>
			<input
				id="song-title-input"
				type="text"
				class="input-bordered input w-full"
				placeholder="e.g. Riptide by Vance Joy"
				bind:value={songTitleInput}
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						event.preventDefault();
						confirmDownload();
					}
				}}
			/>
			{#if songTitleError}
				<p class="mt-2 text-sm text-error">{songTitleError}</p>
			{/if}
		</div>

		<div class="modal-action">
			<button type="button" class="btn" onclick={closeDialog}>Cancel</button>
			<button type="button" class="btn btn-primary" onclick={confirmDownload}>Download</button>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button aria-label="Close popup">close</button>
	</form>
</dialog>
