import type { Metal, Ore, OreInfo, Params, Result } from "./interfaces"

function* product<T>(...args: T[][]): Iterable<T[]> {
	const pools = args.map(pool => Array.from(pool));
	let result: T[][] = [[]];
	for (const pool of pools) {
		const temp: T[][] = [];
		for (const x of result)
			for (const y of pool)
				temp.push([...x, y]);
		result = temp;
	}
	for (const prod of result)
		yield prod;
}

export function generateAlloyCombinations(metals: Metal[], ores: Ore[], params: Params): Result {
	const { multipleOf, tolerance, min, max, count } = params;

	const validCombinations = [];
	const approximationCombinations = [];

	// Approximating max quantity
	const maxQuantity = Math.floor(max / multipleOf);

	for (const quantities of product(...ores.map(ore => Array.from({ length: (ore.quantity || maxQuantity) + 1 }, (_, i) => i)))) {
		if (validCombinations.length >= count)
			break;

		let totalWeight = 0;
		const totalQuantity = quantities.reduce((acc, val) => acc + val, 0);
		const details: OreInfo[] = [];

		if (totalQuantity == 0)
			continue;

		ores.forEach((ore, i) => {
			if (quantities[i] > 0) {
				const weight = quantities[i] * ore.weight;
				totalWeight += weight;
				details.push({ id: ore.id, name: ore.name, weight, quantity: quantities[i], percent: (quantities[i] / totalQuantity) * 100 });
			}
		});

		if (totalWeight < min || totalWeight > max)
			continue;

		let percentagesMet = true;
		metals.forEach((metal) => {
			const metalQuantity = details
				.filter(w => w.id === metal.id)
				.reduce((acc, val) => acc + val.quantity, 0);
			const percentage = (metalQuantity / totalQuantity) * 100;

			if (!(metal.percent.min <= percentage && percentage <= metal.percent.max))
				percentagesMet = false;
		});

		if (totalWeight % multipleOf === 0 && totalWeight > 0 && percentagesMet)
			validCombinations.push({ totalWeight, details });
		else if (Math.abs(totalWeight - multipleOf) <= tolerance && percentagesMet)
			approximationCombinations.push({ totalWeight, details });
	}

	return validCombinations.length > 0
		? {
			approximation: false,
			combinations: validCombinations
				.sort((a, b) => a.totalWeight - b.totalWeight)
		}
		: {
			approximation: true,
			combinations: approximationCombinations
				.sort((a, b) => a.totalWeight - b.totalWeight)
		};
}