import { Category } from "../entity/category";

/**
 * Category list response
 */
export interface CategoryListResponse {
	items: Category[];
	totalCount: number;
}
