import { registerSchema } from './registerSchema';
import { loginSchema } from './loginSchema';
import { resetPasswordSchema } from './resetPasswordSchema';
it('requires eight characters only for register/reset and matching confirmation', () => {
  expect(loginSchema.safeParse({ email: 'demo@example.com', password: 'x' }).success).toBe(true);
  const base = { fullName: ' Demo ', email: ' demo@example.com ', password: '12345678', confirmPassword: '12345678' };
  expect(registerSchema.parse(base).fullName).toBe('Demo');
  expect(registerSchema.safeParse({ ...base, password: '1234567' }).success).toBe(false);
  expect(resetPasswordSchema.safeParse({ password: '12345678', confirmPassword: 'different' }).success).toBe(false);
});
