<script>
	import "../app.css";
	
	import { PUBLIC_GITHUB } from "$env/static/public";

	import { DarkMode, Button } from "flowbite-svelte";
	import { GithubSolid } from "flowbite-svelte-icons";

	const btnClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg text-xl p-2 h-[40px] w-[40px] flex items-center justify-center border-none";
</script>

<svelte:head>
	<title>Ore calculator</title>
</svelte:head>

<div class="flex flex-row justify-between h-[75px] px-8 py-4 items-center">
	<h1 class="text-3xl font-bold">TerraFirma ore calculator</h1>

	<div class="flex flex-row gap-2">
		{#if PUBLIC_GITHUB}
			<Button class={btnClass} href={PUBLIC_GITHUB} target="_blank" color="alternative"><GithubSolid /></Button>
		{/if}
		<DarkMode {btnClass}/>
	</div>
</div>
<div class="h-[calc(100vh-75px)]">
	<slot/>
</div>
