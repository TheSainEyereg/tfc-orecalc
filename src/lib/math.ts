import type { Combination, Metal, Ore, OreInfo, Params, Result } from "./interfaces"

function* product<T>(...pools: T[][]): Iterable<T[]> {
    const head = pools[0];
    const tail = pools.slice(1);
    const remainder = tail.length > 0 ? product(...tail) : [[]];
    for (let r of remainder)
		for (let h of head)
			yield [h, ...r];
}

export function generateAlloyCombinations(metals: Metal[], ores: Ore[], params: Params): Result {
	const { multipleOf, tolerance, min, max, count, timeout } = params;

	const validCombinations: Combination[] = [];
	const approximationCombinations: Combination[] = [];

	const start = Date.now();
	let timedout = false;

	for (const quantities of product(...ores.map(ore => Array.from({ length: (ore.quantity || 64) + 1 }, (_, i) => i)))) {
		if ((timedout = Date.now() - start > timeout * 1000) || validCombinations.length >= count)
			break;

		let finalWeight = 0;
		const totalQuantity = quantities.reduce((acc, val) => acc + val, 0);
		const details: OreInfo[] = [];

		if (totalQuantity == 0)
			continue;

		ores.forEach((ore, i) => {
			if (quantities[i] > 0) {
				const weight = quantities[i] * ore.weight;
				finalWeight += weight;
				details.push({ id: ore.id, name: ore.name, weight, quantity: quantities[i] });
			}
		});

		if (finalWeight < min || finalWeight > max)
			continue;

		let percentagesMet = true;
		metals.forEach((metal) => {
			const metalWeight = details
				.filter(w => w.id === metal.id)
				.reduce((acc, val) => acc + val.weight, 0);
			const percentage = (metalWeight / finalWeight) * 100;

			if (!(metal.percent.min <= percentage && percentage <= metal.percent.max))
				percentagesMet = false;
		});

		if (!percentagesMet)
			continue;

		const valid = finalWeight % multipleOf === 0 && finalWeight > 0;
		const approximation = Math.abs(finalWeight - multipleOf) <= tolerance && finalWeight > 0;
		
		if (!valid && !approximation)
			continue;

		(valid ? validCombinations : approximationCombinations).push({
			details,
			finalWeight: {
				total: finalWeight,
				quantity: Math.floor(finalWeight / multipleOf),
				additional: finalWeight - multipleOf * Math.floor(finalWeight / multipleOf),
				multipleOf
			}
		});
	}

	return {
		...validCombinations.length > 0
		? {
			approximation: false,
			combinations: validCombinations
				.sort((a, b) => a.finalWeight.total - b.finalWeight.total)
		}
		: {
			approximation: true,
			combinations: approximationCombinations
				.sort((a, b) => a.finalWeight.total - b.finalWeight.total)
				.slice(0, count)
		},
		time: (Date.now() - start) / 1000,
		timedout
	};
}