export type ApiFailure = { isSuccess: false; message: string; statusCode?: number; fieldErrors?: Record<string, string[]> };
export type ApiResponse<T = unknown> = { isSuccess: true; data: T; message?: string; statusCode?: number } | ApiFailure;
export type ApiError = ApiFailure;
