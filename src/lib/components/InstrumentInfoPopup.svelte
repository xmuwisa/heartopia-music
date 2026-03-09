<script lang="ts">
	import { Icon, InformationCircle } from 'svelte-hero-icons';
	import { KEYS_INFO_MAP } from '$lib/keys-info';
	import type { KeySetting } from '$lib/translators';

	let dialogEl: HTMLDialogElement;

	export let keySetting: KeySetting;

	$: info = KEYS_INFO_MAP[keySetting];

	const isExternalUrl = (value: string): boolean => /^https?:\/\//.test(value);

	const openDialog = (): void => {
		dialogEl?.showModal();
	};
</script>

<div class="tooltip tooltip-bottom lg:tooltip-right" data-tip="Guide">
	<button
		type="button"
		class="btn btn-square btn-ghost btn-sm"
		aria-label="Guide"
		onclick={openDialog}
	>
		<Icon src={InformationCircle} class="h-5 w-5" solid />
	</button>
</div>

<dialog bind:this={dialogEl} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">{info.title}</h3>
		<p class="py-2 text-sm">{info.description}</p>

		{#if info.status === 'ready'}
			<div class="overflow-x-auto">
				<table class="table w-full table-sm">
					<tbody class="block sm:table-row-group">
						{#each info.table as row}
							<tr class="block border-b border-base-300 last:border-b-0 sm:table-row">
								<td class="block px-0 py-2 sm:table-cell sm:px-2">
									<strong>{row.category}</strong>
								</td>
								<td class="block px-0 py-2 sm:table-cell sm:px-2">
									<span class="font-semibold text-secondary sm:hidden">Example</span>
									{#if row.example}
										{#if isExternalUrl(row.example)}
											<a
												href={row.example}
												target="_blank"
												rel="noopener noreferrer"
												class="ml-2 link break-all link-primary sm:ml-0"
											>
												{row.example}
											</a>
										{:else}
											<code class="ml-2 sm:ml-0">{row.example}</code>
										{/if}
									{/if}
								</td>
								<td class="block px-0 py-2 sm:table-cell sm:px-2">
									<span class="font-semibold text-secondary sm:hidden">Description</span>
									<span class="ml-2 sm:ml-0">{row.description}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<div class="modal-action">
			<button type="button" class="btn" onclick={() => dialogEl.close()}>Close</button>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button aria-label="Close popup">close</button>
	</form>
</dialog>
