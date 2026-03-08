<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="app-shell">
	<Header />
	<div class="content-shell">
		<Sidebar />
		<main class="main-content">
			{@render children()}
		</main>
	</div>
	<Footer />
</div>

<style>
	.app-shell {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr auto;
	}

	.content-shell {
		display: grid;
		grid-template-columns: 240px minmax(0, 1fr);
	}

	.main-content {
		padding: 1.5rem;
	}

	@media (max-width: 768px) {
		.content-shell {
			grid-template-columns: 1fr;
		}
	}
</style>
