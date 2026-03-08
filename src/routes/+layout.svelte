<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initializeTheme } from '$lib/theme';

	let { children } = $props();

	onMount(() => {
		initializeTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script
		data-name="BMC-Widget"
		data-cfasync="false"
		src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
		data-id="luisaeustaquio"
		data-description="Support me on Buy me a coffee!"
		data-message=""
		data-color="#FFDD00"
		data-position="Right"
		data-x_margin="18"
		data-y_margin="18"
	></script>
</svelte:head>
<div class="relative">
	<Header />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
