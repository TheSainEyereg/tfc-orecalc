import { persisted } from "svelte-persisted-store"
import type { Component, Ore } from "./interfaces"

export const params = persisted('params', {
	components: [
		{
			id: "",
			percent: {
				min: 0,
				max: 50
			}
		}
	] as Component[],
	ores: [
		{
			name: "",
			id: "",
			millibuckets: 0
		}
	] as Ore[],
	multipleOf: 144
})