export interface Component {
	id: string;
	percent: {
		min: number;
		max: number;
	};
}

export interface Ore {
	name: string;
	// amount?: number;
	id: string;
	millibuckets: number;
}