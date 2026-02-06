/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
	isSuccess: boolean;
	data: T;
	message?: string;
	errors?: string[];
}

/**
 * Error response from API
 */
export interface ApiError {
	isSuccess: false;
	message: string;
	errors?: string[];
}
