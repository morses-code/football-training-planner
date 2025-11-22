export interface Coach {
	id: string;
	name: string;
	email: string;
	avatar: string | null;
	role: string;
}

export interface Drill {
	id: string;
	name: string;
	description: string;
	category: string;
	duration: number;
	min_players: number;
	max_players: number;
}

export interface Slot {
	id: string;
	type: string;
	name: string;
	duration: number;
	drillId: string | null;
	drill: Drill | null;
	coaches: Coach[];
}
