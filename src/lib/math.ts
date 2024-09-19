import type { Component, Ore } from "./interfaces"

interface Result {
	name: string;
	count: number;
	millibuckets: number;
	percentage: number;
}

export const calculateOres = (multipleOf: number, required: Component[], ores: Ore[]): Result[] => {
	// TODO
	return [];
};
