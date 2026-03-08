<script lang="ts">
	import type { Instrument } from '$lib/instruments';

	export let instrument: Instrument;
</script>

<section class="w-full rounded-xl border border-base-300 bg-base-100 p-4">
	<h2 class="title text-2xl text-primary">{instrument}</h2>
	<p class="mt-2 text-base-content/70">You selected the {instrument} section.</p>
</section>
