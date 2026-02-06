/**
 * Product size/variant with different price
 */
export interface ProductSize {
	id: string;
	name: string; // S, M, L, XL
	price: number;
	isDefault: boolean;
}

/**
 * Product entity
 */
export interface Product {
	id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	categoryId: string;
	categoryName?: string;
	basePrice: number;
	sizes: ProductSize[];
	toppingIds?: string[];
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
}
