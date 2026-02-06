/**
 * Voucher discount type
 */
export type VoucherDiscountType = "percentage" | "fixed";

/**
 * Voucher entity
 */
export interface Voucher {
	id: string;
	code: string;
	name: string;
	description?: string;
	discountType: VoucherDiscountType;
	discountValue: number; // percentage (0-100) or fixed amount
	minOrderAmount?: number;
	maxDiscountAmount?: number;
	usageLimit?: number;
	usedCount: number;
	startDate: string;
	endDate: string;
	isActive: boolean;
	createdAt: string;
}
