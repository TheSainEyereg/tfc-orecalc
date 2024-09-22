import { persisted } from "svelte-persisted-store"
import type { Metal, Ore, Params } from "./interfaces"

export const settings = persisted<{ metals: Metal[]; ores: Ore[]; params: Params }>("settings", {
	metals: [
		{
			id: "",
			percent: {
				min: 0,
				max: 50
			}
		}
	],
	ores: [
		{
			name: "",
			id: "",
			weight: 0,
			quantity: 0
		}
	],
	params: {
		multipleOf: 144,
		tolerance: 30,
		count: 5,
		timeout: 10,
		min: 144,
		max: 1440
	}
})