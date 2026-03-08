<script>
	import { Settings, Music, House } from 'lucide-svelte';
</script>

<header>
	<nav class="bg-base-200 flex w-full items-center justify-center rounded-full p-4">
		<div class="flex flex-row items-center justify-center gap-2">
			<a href="/" class="nav-link"><House size={20} /></a>
			<a href="/music" class="nav-link"><Music size={20} /></a>
			<a href="/settings" class="nav-link"><Settings size={20} /></a>
		</div>
	</nav>
</header>
