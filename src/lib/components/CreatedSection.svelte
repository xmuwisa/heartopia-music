<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Icon, Trash, ArrowsPointingOut, ArrowLeft, Play, Pause, Plus } from 'svelte-hero-icons';
	import InstrumentSavePopup from '$lib/components/InstrumentSavePopup.svelte';
	import {
		deleteCreatedTranslation,
		getCreatedTranslations,
		saveCreatedTranslation,
		updateCreatedTranslation,
		type CreatedTranslation
	} from '$lib/created-translations';

	let createdTranslations: CreatedTranslation[] = [];
	let deleteDialogEl: HTMLDialogElement;
	let pendingDeleteEntry: CreatedTranslation | null = null;
	let expandedEntry: CreatedTranslation | null = null;
	let isEditorOpen = false;
	let editorNotes = '';
	let originalEditorNotes = '';
	let editorScrollEl: HTMLTextAreaElement;
	let savePopupRef: { open: () => void } | null = null;

	let isAutoScrolling = false;
	let autoScrollSpeed = 30;
	let autoScrollAnimationFrame: number | null = null;
	let autoScrollLastTimestamp: number | null = null;
	let autoScrollPixelRemainder = 0;
	let autoScrollStartDelaySeconds = 0;
	let autoScrollDelayTimer: ReturnType<typeof setTimeout> | null = null;
	let previousBodyOverflow = '';

	onMount(() => {
		createdTranslations = getCreatedTranslations();
	});

	$: isEditingExistingEntry = expandedEntry !== null;
	$: canSaveCurrent = isEditingExistingEntry
		? editorNotes !== originalEditorNotes
		: editorNotes.trim().length > 0;

	function requestDeleteTranslation(entry: CreatedTranslation): void {
		pendingDeleteEntry = entry;
		deleteDialogEl?.showModal();
	}

	function cancelDeleteTranslation(): void {
		pendingDeleteEntry = null;
		deleteDialogEl?.close();
	}

	function confirmDeleteTranslation(): void {
		if (!pendingDeleteEntry) return;
		deleteCreatedTranslation(pendingDeleteEntry.id);
		createdTranslations = createdTranslations.filter(
			(entry) => entry.id !== pendingDeleteEntry?.id
		);
		cancelDeleteTranslation();
	}

	function openCreateEditor(): void {
		isEditorOpen = true;
		editorNotes = '';
		originalEditorNotes = '';
		expandedEntry = null;
		stopAutoScroll();
		lockBodyScroll();
	}

	function expandCreatedTranslation(id: string): void {
		isEditorOpen = true;
		expandedEntry = createdTranslations.find((entry) => entry.id === id) ?? null;
		editorNotes = expandedEntry?.notes ?? '';
		originalEditorNotes = expandedEntry?.notes ?? '';
		stopAutoScroll();
		lockBodyScroll();
	}

	function closeEditor(): void {
		stopAutoScroll();
		isEditorOpen = false;
		expandedEntry = null;
		editorNotes = '';
		originalEditorNotes = '';
		unlockBodyScroll();
	}

	function saveCurrent(): void {
		if (!canSaveCurrent) return;

		if (expandedEntry) {
			const updatedEntry = updateCreatedTranslation(expandedEntry.id, editorNotes);
			if (!updatedEntry) return;

			createdTranslations = createdTranslations.map((entry) =>
				entry.id === updatedEntry.id ? updatedEntry : entry
			);
			expandedEntry = updatedEntry;
			originalEditorNotes = editorNotes;
			return;
		}

		savePopupRef?.open();
	}

	function handleSaveConfirm(event: CustomEvent<string>): void {
		const title = event.detail;
		const savedEntry = saveCreatedTranslation({
			title,
			notes: editorNotes
		});

		createdTranslations = [savedEntry, ...createdTranslations];
		closeEditor();
	}

	function lockBodyScroll(): void {
		if (typeof document === 'undefined') return;
		previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		document.body.classList.add('hide-bmc-widget');
	}

	function unlockBodyScroll(): void {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = previousBodyOverflow;
		document.body.classList.remove('hide-bmc-widget');
	}

	function startAutoScroll(): void {
		if (!editorScrollEl || autoScrollAnimationFrame || autoScrollDelayTimer) return;

		const beginScrolling = (): void => {
			autoScrollLastTimestamp = null;
			autoScrollPixelRemainder = 0;

			const tick = (timestamp: number): void => {
				if (!editorScrollEl || !isAutoScrolling) return;

				if (autoScrollLastTimestamp === null) {
					autoScrollLastTimestamp = timestamp;
				}

				const deltaSeconds = (timestamp - autoScrollLastTimestamp) / 1000;
				autoScrollLastTimestamp = timestamp;

				autoScrollPixelRemainder += autoScrollSpeed * deltaSeconds;
				const step = Math.floor(autoScrollPixelRemainder);
				if (step > 0) {
					autoScrollPixelRemainder -= step;
					const maxScrollTop = editorScrollEl.scrollHeight - editorScrollEl.clientHeight;
					editorScrollEl.scrollTop = Math.min(editorScrollEl.scrollTop + step, maxScrollTop);

					if (editorScrollEl.scrollTop >= maxScrollTop) {
						stopAutoScroll();
						return;
					}
				}

				autoScrollAnimationFrame = requestAnimationFrame(tick);
			};

			autoScrollAnimationFrame = requestAnimationFrame(tick);
		};

		const delayMs = Math.max(0, autoScrollStartDelaySeconds * 1000);
		if (delayMs === 0) {
			beginScrolling();
			return;
		}

		autoScrollDelayTimer = setTimeout(() => {
			autoScrollDelayTimer = null;
			if (!isAutoScrolling) return;
			beginScrolling();
		}, delayMs);
	}

	function stopAutoScroll(): void {
		if (autoScrollAnimationFrame !== null) {
			cancelAnimationFrame(autoScrollAnimationFrame);
			autoScrollAnimationFrame = null;
		}
		if (autoScrollDelayTimer) {
			clearTimeout(autoScrollDelayTimer);
			autoScrollDelayTimer = null;
		}
		autoScrollLastTimestamp = null;
		autoScrollPixelRemainder = 0;
		isAutoScrolling = false;
	}

	function toggleAutoScroll(): void {
		if (isAutoScrolling) {
			stopAutoScroll();
			return;
		}

		isAutoScrolling = true;
		startAutoScroll();
	}

	function handleSpeedChange(event: Event): void {
		autoScrollSpeed = Number((event.currentTarget as HTMLInputElement).value);
	}

	function handleDelayChange(event: Event): void {
		autoScrollStartDelaySeconds = Number((event.currentTarget as HTMLInputElement).value);
	}

	function formatCreatedAt(createdAt: string): string {
		return new Date(createdAt).toLocaleString();
	}

	onDestroy(() => {
		stopAutoScroll();
		unlockBodyScroll();
	});
</script>

<div class="w-full space-y-4">
	<button type="button" class="btn w-full btn-primary" onclick={openCreateEditor}>
		<Icon src={Plus} class="h-5 w-5" solid />
		Create Notes
	</button>

	{#if createdTranslations.length === 0}
		<div class="rounded-box border border-base-300 bg-base-100 p-6 text-center">
			<p class="opacity-75">No created notes yet. Start with a blank one. ^^</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each createdTranslations as entry (entry.id)}
				<article class="rounded-box border border-base-300 bg-base-100 p-4">
					<div class="mb-3 flex items-start justify-between gap-3">
						<div>
							<h2 class="text-lg font-bold text-primary">{entry.title}</h2>
							<p class="text-xs opacity-70">{formatCreatedAt(entry.createdAt)}</p>
						</div>
						<div class="flex items-center gap-1">
							<button
								type="button"
								class="btn btn-square btn-ghost btn-sm"
								aria-label={`Delete ${entry.title}`}
								onclick={() => requestDeleteTranslation(entry)}
							>
								<Icon src={Trash} class="h-5 w-5" solid />
							</button>
							<button
								type="button"
								class="btn btn-square btn-ghost btn-sm"
								aria-label={`Expand ${entry.title}`}
								onclick={() => expandCreatedTranslation(entry.id)}
							>
								<Icon src={ArrowsPointingOut} class="h-5 w-5" solid />
							</button>
						</div>
					</div>

					<pre
						class="max-h-32 overflow-auto rounded border border-base-300 bg-base-200 p-2 text-xs whitespace-pre-wrap">{entry.notes}</pre>
				</article>
			{/each}
		</div>
	{/if}
</div>

{#if isEditorOpen}
	<section class="fixed inset-0 z-50 flex h-screen flex-col overflow-hidden bg-base-100">
		<header class="border-b border-base-300 bg-base-100 p-4">
			<div class="mx-auto flex w-full max-w-5xl flex-col gap-3 md:flex-row md:items-center">
				<button type="button" class="btn self-start btn-ghost" onclick={closeEditor}>
					<Icon src={ArrowLeft} class="h-5 w-5" solid />
					Back
				</button>

				<div
					class="flex w-full min-w-0 flex-col items-stretch gap-3 md:flex-1 md:flex-row md:items-center md:justify-end"
				>
					<button type="button" class="btn w-full btn-primary md:w-auto" onclick={toggleAutoScroll}>
						<Icon src={isAutoScrolling ? Pause : Play} class="h-5 w-5" solid />
						{isAutoScrolling ? 'Pause auto-scroll' : 'Start auto-scroll'}
					</button>

					<button
						type="button"
						class="btn w-full btn-secondary md:w-auto"
						onclick={saveCurrent}
						disabled={!canSaveCurrent}
					>
						Save
					</button>

					<label class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 text-sm md:w-auto">
						<span>Speed</span>
						<input
							type="range"
							class="range w-full range-accent range-sm md:w-36"
							min="8"
							max="200"
							step="2"
							value={autoScrollSpeed}
							oninput={handleSpeedChange}
						/>
						<span class="w-14 text-right">{autoScrollSpeed}px/s</span>
					</label>

					<label class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 text-sm md:w-auto">
						<span>Delay</span>
						<input
							type="range"
							class="range w-full range-secondary range-sm md:w-28"
							min="0"
							max="10"
							step="1"
							value={autoScrollStartDelaySeconds}
							oninput={handleDelayChange}
						/>
						<span class="w-10 text-right">{autoScrollStartDelaySeconds}s</span>
					</label>
				</div>
			</div>
		</header>

		<div class="flex-1 overflow-hidden p-4">
			<div
				class="mx-auto h-full w-full max-w-5xl rounded-box border border-base-300 bg-base-200 p-4"
			>
				<div class="mb-3">
					<h2 class="text-lg font-bold text-primary">
						{expandedEntry ? expandedEntry.title : 'New Blank Notes'}
					</h2>
					<p class="text-xs opacity-70">
						{expandedEntry
							? 'Auto-scroll or edit current notes.'
							: 'Type your notes and save when ready.'}
					</p>
				</div>

				<textarea
					bind:this={editorScrollEl}
					bind:value={editorNotes}
					class="h-[calc(100%-3.5rem)] w-full resize-none rounded border border-base-300 bg-base-100 p-4 text-sm leading-relaxed"
					placeholder="Type your custom notes here..."
				></textarea>
			</div>
		</div>
	</section>
{/if}

<dialog bind:this={deleteDialogEl} class="modal">
	<div class="modal-box">
		<h3 class="title text-center text-3xl text-primary">DELETE TRANSLATION</h3>
		<p class="mt-2 text-center text-sm opacity-75">
			Are you sure you want to delete
			<strong>{pendingDeleteEntry?.title ?? 'this translation'}</strong>? This action cannot be
			undone.
		</p>

		<div class="modal-action">
			<button type="button" class="btn" onclick={cancelDeleteTranslation}>Cancel</button>
			<button type="button" class="btn btn-error" onclick={confirmDeleteTranslation}>Delete</button>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop" onsubmit={cancelDeleteTranslation}>
		<button aria-label="Close popup">close</button>
	</form>
</dialog>

<InstrumentSavePopup
	bind:this={savePopupRef}
	heading="SAVE NOTES"
	description="Enter a title so you can find these notes later."
	on:confirm={handleSaveConfirm}
/>
