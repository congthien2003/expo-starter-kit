/**
 * Generic API response wrapper used across all services.
 */
export interface ApiResponse<T = unknown> {
	isSuccess: boolean;
	data?: T;
	message?: string;
	statusCode?: number;
}
