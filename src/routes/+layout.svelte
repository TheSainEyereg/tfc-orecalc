<script>
	import "../app.css";
	import { DarkMode } from "flowbite-svelte";
</script>

<svelte:head>
	<title>Ore calculator</title>
</svelte:head>

<div class="flex flex-row justify-between h-[75px] px-8 py-4">
	<h1 class="text-3xl font-bold">TerraFirma ore calculator</h1>
	<DarkMode />
</div>
<div class="h-[calc(100vh-75px)]">
	<slot/>
</div>
