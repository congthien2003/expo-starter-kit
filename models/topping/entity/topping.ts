/**
 * Topping entity
 */
export interface Topping {
	id: string;
	name: string;
	price: number;
	imageUrl?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
}
