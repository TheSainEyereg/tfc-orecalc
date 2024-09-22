<script lang="ts">
	import type { Metal, Ore, Params, Result } from "$lib/interfaces";
	import { settings } from "$lib/stores";
	import { generateAlloyCombinations } from "$lib/math";

	import { Button, Input, NumberInput, Select, Range, Label, Alert, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { CloseCircleSolid, InfoCircleSolid } from "flowbite-svelte-icons";

	let metals: Metal[] = $settings.metals;
	let ores: Ore[] = $settings.ores;
	let params: Params = $settings.params;

	$: params, metals, ores, settings.set({ metals, ores, params });

	let result: Result | null = null;

	const calculate = () =>
		result = generateAlloyCombinations(metals, ores, params);
</script>

<div class="grid grid-cols-3 divide-x h-full">
	<div class="flex flex-col gap-6 p-8 overflow-y-auto">
		<h1 class="text-3xl font-bold">Requirements</h1>

		<div class="flex w-full flex-col gap-4">
			<div class="flex w-full flex-col gap-2">
				<Label>Multiple of</Label>
				<div class="flex flex-row gap-2 items-center">
					<NumberInput bind:value={params.multipleOf} />
					<Label>mB</Label>
				</div>
			</div>
			<div class="flex w-full flex-col gap-2">
				<Label>Approximation tollerance: {params.tolerance} mB</Label>
				<Range bind:value={params.tolerance} max={params.multipleOf - 1} min={0} step={1}/>
			</div>
			<div class="flex w-full flex-row gap-2">
				<div class="flex w-full flex-col gap-2">
					<Label>Min mB</Label>
					<NumberInput bind:value={params.min} />
				</div>
				<div class="flex w-full flex-col gap-2">
					<Label>Max mB</Label>
					<NumberInput bind:value={params.max} />
				</div>
			</div>
		</div>
	
		Metal proportions
	
		<div class="flex w-full flex-col gap-4">
			<Button
				on:click={() => metals = [...metals, { id: "", percent: { min: 0, max: 100 - metals.reduce((a, b) => a + b.percent.min, 0) } }]}
			>
				Add
			</Button>
			{#each metals as metal, i}
			<!-- {#if i > 0}<Separator class="my-2"/>{/if} -->
				<div class="flex flex-col gap-2">
					<div class="flex flex-row gap-2">
						<Input type="text" placeholder="Name" bind:value={metal.id} />
						<Button
							color="red"
							on:click={() => metals = metals.filter(r => r !== metal)}
						><CloseCircleSolid/></Button>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Min: {metal.percent.min}%</Label>
						<Range bind:value={metal.percent.min} max={metal.percent.max} min={0} step={1}/>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Max: {metal.percent.max}%</Label>
						<Range bind:value={metal.percent.max} min={metal.percent.min} max={100 - metals.reduce((acc, v, k) => k === i ? acc : acc + v.percent.min, 0)} step={1}/>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col gap-6 p-8 overflow-y-auto">
		<h1 class="text-3xl font-bold">Ores</h1>

		<div class="flex w-full flex-col gap-4">
			<Button
				on:click={() => ores = [...ores, { name: "", id: "", weight: 0, quantity: 0 }]}
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
					<div class="flex flex-row gap-2 items-center">
						<Label class="text-sm text-nowrap">Quantity (optional)</Label>
						<NumberInput bind:value={ore.quantity} />
						{#if ore.quantity}
							<Button
								color="alternative"
								on:click={() => ore.quantity = 0}
							><CloseCircleSolid/></Button>
						{/if}
					</div>

					<div class="flex flex-col gap-2">
						<!-- <span class="text-sm">Contains</span> -->
						<Select
							bind:value={ore.id}
							disabled={metals.filter(r => Boolean(r.id)).length === 0}
							items={metals.map(r => ({ value: r.id, name: r.id }))}
							placeholder="Select containing component"
						></Select>
						<div class="flex flex-row gap-2 items-center">
							<NumberInput bind:value={ore.weight} />
							<Label>mB</Label>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col gap-6 p-8 overflow-y-auto">
		<h1 class="text-3xl font-bold">Result</h1>

		
		<div class="flex w-full flex-col gap-4">
			<div class="flex w-full flex-col gap-2">
				<Label>Limit: {params.count} combination{params.count > 1 ? "s" : ""}</Label>
				<Range bind:value={params.count} min={1} max={100} step={1}/>
			</div>
			<div class="flex w-full flex-col gap-2">
				<Label>Timeout: {params.timeout} seconds</Label>
				<Range bind:value={params.timeout} min={5} max={30} step={1}/>
			</div>
			<Button on:click={calculate}>Calculate</Button>
		</div>

		{#if result !== null}
			{#if result.combinations.length > 0}
				{#if result.approximation}
					<Alert color="yellow">
						<InfoCircleSolid slot="icon" class="w-5 h-5" />
						<span class="font-medium">No valid combinations found. Showing approximations</span>
					</Alert>
				{/if}
				{#if result.timeout}
					<Alert>
						<InfoCircleSolid slot="icon" class="w-5 h-5" />
						<span class="font-medium">Calculation timed out</span>
					</Alert>
				{/if}
				<span>Found {result.combinations.length} combination{result.combinations.length > 1 ? "s" : ""} (took {result.time.toFixed(2)} seconds)</span>
				<div class="flex w-full flex-col gap-4">
					{#each result.combinations as combination}
						<div class="flex w-full flex-col gap-2">
							<Label>Total weight: {combination.finalWeight.multipleOf} * {combination.finalWeight.quantity}{combination.finalWeight.additional ?` + ${combination.finalWeight.additional}` : ""} = {combination.finalWeight.total} mB</Label>
							<Table>
								<TableHead>
									<TableHeadCell>Ore</TableHeadCell>
									<TableHeadCell>Quantity</TableHeadCell>
									<TableHeadCell>mB</TableHeadCell>
									<TableHeadCell>Percent</TableHeadCell>
								</TableHead>
								<TableBody tableBodyClass="divide-y">
									{#each combination.details as ore}
										<TableBodyRow>
											<TableBodyCell>{ore.name}</TableBodyCell>
											<TableBodyCell>{ore.quantity}</TableBodyCell>
											<TableBodyCell>{ore.weight}</TableBodyCell>
											<TableBodyCell>{ore.percent.toFixed(2)}%</TableBodyCell>
										</TableBodyRow>
									{/each}
								</TableBody>
							</Table>
						</div>
					{/each}
				</div>
			{:else}
				<Alert color="red">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					<span class="font-medium">No combinations (including approximate) found</span>
				</Alert>
			{/if}
		{/if}
	</div>
</div>
