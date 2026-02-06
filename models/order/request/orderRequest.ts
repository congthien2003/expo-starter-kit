/**
 * Create order item request
 */
export interface CreateOrderItemRequest {
	productId: string;
	sizeId: string;
	quantity: number;
	toppings: {
		toppingId: string;
		quantity: number;
	}[];
	note?: string;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
	items: CreateOrderItemRequest[];
	includeVat: boolean;
	voucherCode?: string;
	note?: string;
}

/**
 * Update order status request
 */
export interface UpdateOrderStatusRequest {
	status: string;
}
