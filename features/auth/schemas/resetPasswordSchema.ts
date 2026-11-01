import { z } from 'zod';
export const resetPasswordSchema = z.object({ password: z.string().min(8, 'Use at least 8 characters.'), confirmPassword: z.string().min(1, 'Confirm your password.') }).refine(value => value.password === value.confirmPassword, { path: ['confirmPassword'], message: 'Passwords must match.' });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
