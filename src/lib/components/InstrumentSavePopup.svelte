<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ confirm: string }>();

	let dialogEl: HTMLDialogElement;
	let titleInput = '';
	let titleError = '';

	export function open(): void {
		titleInput = '';
		titleError = '';
		dialogEl?.showModal();
	}

	function closeDialog(): void {
		dialogEl?.close();
	}

	function confirmSave(): void {
		const title = titleInput.trim();
		if (!title) {
			titleError = 'Title is required.';
			return;
		}

		titleError = '';
		dispatch('confirm', title);
		closeDialog();
	}
</script>

<dialog bind:this={dialogEl} class="modal">
	<div class="modal-box">
		<h3 class="title text-center text-3xl text-primary">SAVE TRANSLATION</h3>
		<p class="mt-1 text-center text-sm opacity-70">
			Enter a title so you can find this translation later.
		</p>

		<div class="form-control mt-4">
			<label for="save-title-input" class="label">
				<span class="label-text font-medium">Title</span>
			</label>
			<input
				id="save-title-input"
				type="text"
				class="input-bordered input w-full"
				placeholder="e.g. Riptide by Vance Joy"
				bind:value={titleInput}
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						event.preventDefault();
						confirmSave();
					}
				}}
			/>
			{#if titleError}
				<p class="mt-2 text-sm text-error">{titleError}</p>
			{/if}
		</div>

		<div class="modal-action">
			<button type="button" class="btn" onclick={closeDialog}>Cancel</button>
			<button type="button" class="btn btn-primary" onclick={confirmSave}>Save</button>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button aria-label="Close popup">close</button>
	</form>
</dialog>
