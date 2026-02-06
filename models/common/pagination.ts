/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
	page?: number;
	pageSize?: number;
	searchTerm?: string | null;
	sortBy?: string | null;
	sortDescending?: boolean | null;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
	items: T[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

/**
 * Default pagination values
 */
export const DEFAULT_PAGINATION: PaginationParams = {
	page: 1,
	pageSize: 20,
	searchTerm: null,
	sortBy: null,
	sortDescending: false,
};
