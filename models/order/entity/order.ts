/**
 * Order item topping
 */
export interface OrderItemTopping {
	toppingId: string;
	toppingName: string;
	price: number;
	quantity: number;
}

/**
 * Order item
 */
export interface OrderItem {
	id: string;
	productId: string;
	productName: string;
	productImageUrl?: string;
	sizeId: string;
	sizeName: string;
	unitPrice: number;
	quantity: number;
	toppings: OrderItemTopping[];
	note?: string;
	subtotal: number;
}

/**
 * Order status enum
 */
export type OrderStatus =
	| "pending"
	| "confirmed"
	| "preparing"
	| "ready"
	| "completed"
	| "cancelled";

/**
 * Order entity
 */
export interface Order {
	id: string;
	orderNumber: string;
	status: OrderStatus;
	items: OrderItem[];
	subtotal: number;
	vatAmount: number;
	vatRate: number; // e.g., 0.1 for 10%
	includeVat: boolean;
	discountAmount: number;
	voucherCode?: string;
	totalAmount: number;
	note?: string;
	createdBy: string;
	createdAt: string;
	updatedAt?: string;
}
