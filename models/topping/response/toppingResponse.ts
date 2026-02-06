import { Topping } from "../entity/topping";

/**
 * Topping list response
 */
export interface ToppingListResponse {
	items: Topping[];
	totalCount: number;
}
