<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Icon, Cog6Tooth, MusicalNote, Heart } from 'svelte-hero-icons';

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
			<a
				href="/"
				class="nav-link transition-all duration-300 hover:scale-110 hover:text-accent"
				class:text-secondary={$page.url.pathname === '/'}
				aria-current={$page.url.pathname === '/' ? 'page' : undefined}
			>
				<Icon src={Heart} class="h-5 w-5" solid />
			</a>
			<a
				href="/music"
				class="nav-link transition-all duration-300 hover:scale-110 hover:text-accent"
				class:text-secondary={$page.url.pathname.startsWith('/music')}
				aria-current={$page.url.pathname.startsWith('/music') ? 'page' : undefined}
			>
				<Icon src={MusicalNote} class="h-5 w-5" solid />
			</a>
			<a
				href="/settings"
				class="nav-link transition-all duration-300 hover:scale-110 hover:text-accent"
				class:text-secondary={$page.url.pathname.startsWith('/settings')}
				aria-current={$page.url.pathname.startsWith('/settings') ? 'page' : undefined}
			>
				<Icon src={Cog6Tooth} class="h-5 w-5" solid />
			</a>
		</div>
	</nav>
</header>
