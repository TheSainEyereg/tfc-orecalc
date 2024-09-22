export interface Metal {
	id: string;
	percent: {
		min: number;
		max: number;
	};
}

export interface Ore {
	name: string;
	quantity: number;
	id: string;
	weight: number;
}

export interface Params {
	multipleOf: number;
	tolerance: number;
	min: number;
	max: number;
	count: number;
	timeout: number;
}

export interface OreInfo {
	id: string;
	name: string;
	weight: number;
	quantity: number;
	percent: number;
}

export interface Combination {
	details: OreInfo[];
	finalWeight: {
		total: number;
		quantity: number;
		additional: number;
		multipleOf: number;
	};
}

export interface Result {
	combinations: Combination[];
	approximation: boolean;
	timeout: boolean;
	time: number;

}