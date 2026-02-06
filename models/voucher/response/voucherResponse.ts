import { Voucher } from "../entity/voucher";

/**
 * Validate voucher response
 */
export interface ValidateVoucherResponse {
	isValid: boolean;
	voucher?: Voucher;
	discountAmount: number;
	message?: string;
}
