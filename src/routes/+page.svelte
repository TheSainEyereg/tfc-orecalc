<script lang="ts">
	import type { Component, Ore } from "$lib/interfaces";
	import { params } from "$lib/stores";
	import { calculateOres } from "$lib/math";

	import { Button, Input, NumberInput, Select, Range, Label, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { CloseCircleSolid } from "flowbite-svelte-icons";

	let multipleOf: number = 144;
	let components: Component[] = [ ];
	let ores: Ore[] = [ ];

	params.subscribe(p => {
		components = p.components;
		ores = p.ores;
		multipleOf = p.multipleOf
	});

	$: multipleOf, components, ores, params.set({ components, ores, multipleOf });
</script>

<div class="grid grid-cols-3 divide-x h-full">
	<div class="flex flex-col gap-6 p-8 overflow-y-auto">
		<h1 class="text-3xl font-bold">Requirements</h1>

		<div class="flex w-full flex-col gap-2">
			Multiple of
			<div class="flex flex-row gap-2 items-center">
				<Input type="number" bind:value={multipleOf} />
				<span>mB</span>
			</div>
		</div>
	
		Component proportions
	
		<div class="flex w-full flex-col gap-4">
			<Button
				on:click={() => components = [...components, { id: "", percent: { min: 0, max: 100 - components.reduce((a, b) => a + b.percent.min, 0) } }]}
			>
				Add
			</Button>
			{#each components as component, i}
			<!-- {#if i > 0}<Separator class="my-2"/>{/if} -->
				<div class="flex flex-col gap-2">
					<div class="flex flex-row gap-2">
						<Input type="text" placeholder="Name" bind:value={component.id} />
						<Button
							color="red"
							on:click={() => components = components.filter(r => r !== component)}
						><CloseCircleSolid/></Button>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Min {component.percent.min}%</Label>
						<Range bind:value={component.percent.min} max={component.percent.max} min={0} step={1}/>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Max {component.percent.max}%</Label>
						<Range bind:value={component.percent.max} min={component.percent.min} max={100 - components.reduce((acc, v, k) => k === i ? acc : acc + v.percent.min, 0)} step={1}/>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col gap-6 p-8 overflow-y-auto">
		<h1 class="text-3xl font-bold">Ores</h1>

		<div class="flex w-full flex-col gap-4">
			<Button
				on:click={() => ores = [...ores, { name: "", id: "", millibuckets: 0 }]}
			>
				Add
			</Button>
			{#each ores as ore, i}
				<!-- {#if i > 0}<Separator class="my-2"/>{/if} -->
				<div class="flex flex-col gap-2">
					<div class="flex flex-row gap-2">
						<Input type="text" placeholder="Name" bind:value={ore.name} />
						<Button
							color="red"
							on:click={() => ores = ores.filter(r => r !== ore)}
						><CloseCircleSolid/></Button>
					</div>
					<!-- <div class="flex flex-row gap-2 items-center">
						<span class="text-sm text-nowrap">Count (optional)</span>
						<NumberInput placeholder="Count (optional)" bind:value={ore.amount} />
						{#if ore.amount}
							<Button
								color="alternative"
								on:click={() => ore.amount = 0}
							><CloseCircleSolid/></Button>
						{/if}
					</div> -->

					<div class="flex flex-col gap-2">
						<!-- <span class="text-sm">Contains</span> -->
						<Select
							bind:value={ore.id}
							disabled={components.filter(r => Boolean(r.id)).length === 0}
							items={components.map(r => ({ value: r.id, name: r.id }))}
							placeholder="Select containing component"
						></Select>
						<div class="flex flex-row gap-2 items-center">
							<NumberInput placeholder="Amount" bind:value={ore.millibuckets} />
							<span>mB</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col gap-6 p-8 overflow-y-auto">
		<h1 class="text-3xl font-bold">Result</h1>

		<Table>
		  <TableHead>
			<TableHeadCell>Ingredient</TableHeadCell>
			<TableHeadCell>Count</TableHeadCell>
			<TableHeadCell>mB</TableHeadCell>
			<TableHeadCell>Percent</TableHeadCell>
		  </TableHead>
		  <TableBody tableBodyClass="divide-y">
			{#if ores.filter(r => Boolean(r.name)).length > 0}
				{#each calculateOres(multipleOf, components, ores.filter(r => Boolean(r.millibuckets))) as ore}
					<TableBodyRow>
						<TableBodyCell>{ore.name}</TableBodyCell>
						<TableBodyCell>{ore.count}</TableBodyCell>
						<TableBodyCell>{ore.millibuckets}</TableBodyCell>
						<TableBodyCell>{ore.percentage}%</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		  </TableBody>
		</Table>
	</div>
</div>
