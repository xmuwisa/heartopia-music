<script lang="ts">
	import CreatedSection from '$lib/components/CreatedSection.svelte';
</script>

<section class="flex min-h-screen w-full flex-col items-center justify-start">
	<div class="flex h-full w-full max-w-xl flex-col items-center justify-center gap-8 p-8">
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="title text-center text-4xl leading-none font-bold text-primary">CREATED NOTES</h1>
		</div>

		<CreatedSection />
	</div>
</section>
