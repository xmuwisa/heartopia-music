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

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="relative">
	<Header />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
