import { Order } from "../entity/order";

/**
 * Order list response
 */
export interface OrderListResponse {
	items: Order[];
	totalCount: number;
}

/**
 * Order detail response
 */
export type OrderDetailResponse = Order;
