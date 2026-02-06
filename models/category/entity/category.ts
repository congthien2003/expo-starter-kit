/**
 * Category entity
 */
export interface Category {
	id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	sortOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
}
