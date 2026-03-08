<script>
	import { onMount } from 'svelte';
	import { Settings, Music, House } from 'lucide-svelte';

	let isScrolled = false;

	const updateScrollState = () => {
		isScrolled = window.scrollY > 0;
	};

	onMount(() => {
		updateScrollState();
		window.addEventListener('scroll', updateScrollState, { passive: true });

		return () => {
			window.removeEventListener('scroll', updateScrollState);
		};
	});
</script>

<header class="sticky top-0 z-20 flex w-full items-center justify-center">
	<nav
		class={`m-2 flex items-center justify-center rounded-full px-6 py-4 transition-all duration-200 ${
			isScrolled ? 'bg-base-200/50 backdrop-blur-md' : 'bg-transparent'
		}`}
	>
		<div class="flex flex-row items-center justify-center gap-2">
			<a href="/" class="nav-link"><House size={20} /></a>
			<a href="/music" class="nav-link"><Music size={20} /></a>
			<a href="/settings" class="nav-link"><Settings size={20} /></a>
		</div>
	</nav>
</header>
