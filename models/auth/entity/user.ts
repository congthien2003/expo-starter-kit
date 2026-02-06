/**
 * User entity
 */
export interface User {
	id: string;
	email: string;
	fullName: string;
	phoneNumber?: string;
	avatar?: string;
	role: string;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
}
