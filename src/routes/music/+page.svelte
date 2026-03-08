<script lang="ts">
	import InstrumentSection from '$lib/components/InstrumentSection.svelte';
	import { INSTRUMENTS, type Instrument } from '$lib/instruments';

	let selectedInstrument: Instrument = INSTRUMENTS[0];
</script>

<section class="flex min-h-screen w-full flex-col items-center justify-start">
	<div class="flex h-full w-full max-w-xl flex-col items-center justify-center gap-8 p-8">
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="title text-center text-4xl leading-none font-bold text-primary">
				MUSIC NOTE TRANSLATOR
			</h1>
			<div>
				<label class="form-control w-full">
					<select class="select-bordered select w-full" bind:value={selectedInstrument}>
						{#each INSTRUMENTS as instrument}
							<option value={instrument}>{instrument}</option>
						{/each}
					</select>
				</label>
			</div>
		</div>

		<InstrumentSection instrument={selectedInstrument} />
	</div>
</section>
