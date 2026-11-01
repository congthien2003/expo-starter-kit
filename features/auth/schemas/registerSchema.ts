import { z } from 'zod';
export const registerSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.string().trim().email('Enter a valid email.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  confirmPassword: z.string().min(1, 'Confirm your password.'),
}).refine(value => value.password === value.confirmPassword, { path: ['confirmPassword'], message: 'Passwords must match.' });
export type RegisterFormValues = z.infer<typeof registerSchema>;
