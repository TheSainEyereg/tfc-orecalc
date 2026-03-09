<script lang="ts">
	import type { Metal, Ore, Params, Result } from "$lib/interfaces";
	import { preset, settings as settingsStore } from "$lib/stores";
	import { generateAlloyCombinations } from "$lib/math";

	import { Card, Button, Input, Select, Range, Label, Alert, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Toggle } from "flowbite-svelte";
	import { TrashBinSolid, InfoCircleSolid, CloseCircleSolid } from "flowbite-svelte-icons";

	let settings = $state($settingsStore);
	$effect(() => settingsStore.set(settings));

	let metals: Metal[] = $state($preset.metals);
	let ores: Ore[] = $state($preset.ores);
	let params: Params = $state($preset.params);
	$effect(() => preset.set({ metals, ores, params }));

	preset.subscribe(p => {
		metals = p.metals;
		ores = p.ores;
		params = p.params;
	});

	let result: Result | null = $state(null);

	const calculate = () =>
		result = generateAlloyCombinations(metals, ores, params, settings);
</script>

<div class="grid grid-cols-3 divide-x h-full">
	<div class="flex flex-col gap-6 p-6 overflow-y-auto">
		<h1 class="text-3xl font-bold">Requirements</h1>

		<div class="flex w-full flex-col gap-4">
			<div class="flex w-full flex-col gap-2">
				<Label>Multiple of</Label>
				<div class="flex flex-row gap-2 items-center">
					<Input type="number" bind:value={params.multipleOf} />
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
					<Input type="number" bind:value={params.min} />
				</div>
				<div class="flex w-full flex-col gap-2">
					<Label>Max mB</Label>
					<Input type="number" bind:value={params.max} />
				</div>
			</div>
		</div>
	
		<div class="flex flex-col gap-4">
			<span>Metal proportions</span>
			<Button
				onclick={() => metals = [...metals, { id: "", percent: { min: 0, max: 100 - metals.reduce((a, b) => a + b.percent.min, 0) } }]}
			>
				Add
			</Button>
			{#each metals as metal, i}
				<Card class="max-w-none p-4 flex flex-col gap-2">
					<div class="flex flex-row gap-2">
						<Input type="text" placeholder="Name" bind:value={metal.id} />
						<Button
							color="red"
							onclick={() => metals = metals.filter(r => r !== metal)}
						><TrashBinSolid/></Button>
					</div>
					<div class="flex flex-row gap-2 items-center">
						<div class="flex flex-col gap-2 flex-1">
							<Label>Min: {metal.percent.min}%</Label>
							<Range bind:value={metal.percent.min} max={metal.percent.max} min={0} step={1}/>
						</div>
						<div class="flex flex-col gap-2 flex-1">
							<Label>Max: {metal.percent.max}%</Label>
							<Range bind:value={metal.percent.max} min={metal.percent.min} max={100 - metals.reduce((acc, v, k) => k === i ? acc : acc + v.percent.min, 0)} step={1}/>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col gap-6 p-6 overflow-y-auto">
		<h1 class="text-3xl font-bold">Ores</h1>

		<div class="flex flex-col gap-4">
			<Button
				onclick={() => ores = [...ores, { name: "", id: "", weight: 0, quantity: 0 }]}
			>
				Add
			</Button>
			{#each ores as ore}
				<Card class="max-w-none p-4 flex flex-col gap-2">
					<div class="flex flex-row gap-2">
						<Input type="text" placeholder="Name" bind:value={ore.name} />
						<Button
							color="red"
							onclick={() => ores = ores.filter(r => r !== ore)}
						><TrashBinSolid/></Button>
					</div>
					<div class="flex flex-row gap-2 items-center">
						<Select
							class="flex-3"
							bind:value={ore.id}
							disabled={metals.filter(r => Boolean(r.id)).length === 0}
							items={metals.map(r => ({ value: r.id, name: r.id }))}
							placeholder="Select containing component"
						></Select>
						<Input class="flex-1" type="number" bind:value={ore.weight} />
						<Label class="w-[60px] text-left">mB</Label>
					</div>
					<div class="flex flex-row gap-2 items-center">
						<Input type="number" bind:value={ore.quantity} placeholder="Limit (optional, default: unlimited)"/>
						{#if typeof ore.quantity === "number"}
							<Button
								color="alternative"
								onclick={() => ore.quantity = void 0}
							><CloseCircleSolid/></Button>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col gap-6 p-6 overflow-y-auto">
		<h1 class="text-3xl font-bold">Result</h1>

		
		<div class="flex w-full flex-col gap-4">
			<div class="flex w-full flex-col gap-2">
				<Label>Limit: {settings.count} combination{settings.count > 1 ? "s" : ""}</Label>
				<Range bind:value={settings.count} min={1} max={100} step={1}/>
			</div>
			<div class="flex w-full flex-col gap-2">
				<Label>Timeout: {settings.timeout} seconds</Label>
				<Range bind:value={settings.timeout} min={5} max={30} step={1}/>
			</div>
			<Button onclick={calculate}>Calculate</Button>
		</div>

		{#if result !== null}
			{#if result.timedout}
				<Alert>
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					<span class="font-medium">Calculation timed out</span>
				</Alert>
			{/if}
			{#if result.combinations.length > 0}
				{#if result.approximation}
					<Alert color="yellow">
						<InfoCircleSolid slot="icon" class="w-5 h-5" />
						<span class="font-medium">No valid combinations found. Showing approximations</span>
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
								<TableBody>
									{#each combination.details as ore}
										<TableBodyRow>
											<TableBodyCell>{ore.name}</TableBodyCell>
											<TableBodyCell>{ore.quantity}</TableBodyCell>
											<TableBodyCell>{ore.weight}</TableBodyCell>
											<TableBodyCell>{(ore.weight / combination.finalWeight.total * 100).toFixed(2)}%</TableBodyCell>
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
					<span class="font-medium">{result.error ?? "No combinations (including approximate) found"}</span>
				</Alert>
			{/if}
		{/if}
	</div>
</div>
