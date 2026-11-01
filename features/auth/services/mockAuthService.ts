import { AppError } from '@/lib/errors';
import type { ApiResponse } from '@/models/common/apiResponse';
import type { LoginRequest, LoginResponse, User } from '../types/auth';
import { loginSchema } from '../schemas/loginSchema';
import { registerSchema } from '../schemas/registerSchema';
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema';
import { sessionManager } from './sessionManager';
import { mockScenarioService } from './mockScenarioService';
import { resetTicketService } from './resetTicketService';
async function wait() {
  const scenario = mockScenarioService.getSnapshot();
  await new Promise(resolve => setTimeout(resolve, 800));
  if (scenario === 'network-error') throw new AppError('network', 'Demo network error. Choose success and retry.');
  return scenario;
}
const mockAuthService = {
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const { email } = loginSchema.parse(payload);
    const scenario = await wait();
    if (scenario === 'invalid-credentials') return { isSuccess: false, message: 'Demo: email or password is incorrect.', statusCode: 401 };
    return { isSuccess: true, data: { accessToken: `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`, expiresIn: scenario === 'session-expired' ? 0 : 3600, user: { id: `mock-${email.toLowerCase()}`, email, fullName: email.split('@')[0], role: 'user', isActive: true, createdAt: new Date().toISOString() } }, statusCode: 200 };
  },
  async register(payload: { fullName: string; email: string; password: string }): Promise<ApiResponse<{ email: string }>> {
    const parsed = registerSchema.parse({ ...payload, confirmPassword: payload.password });
    await wait();
    return { isSuccess: true, data: { email: parsed.email } };
  },
  async forgotPassword(payload: { email: string }): Promise<ApiResponse<{ email: string; ticket: string }>> {
    const { email } = forgotPasswordSchema.parse(payload);
    await wait();
    return { isSuccess: true, data: { email, ticket: resetTicketService.issue(email) } };
  },
  async resetPassword(payload: { ticket: string; password: string }): Promise<ApiResponse<{ email: string }>> {
    if (payload.password.length < 8) throw new AppError('validation', 'Use at least 8 characters.');
    await wait();
    return { isSuccess: true, data: { email: resetTicketService.consume(payload.ticket) } };
  },
  async getMe(): Promise<ApiResponse<User>> {
    await wait();
    await sessionManager.checkExpiry();
    const user = sessionManager.getSnapshot().session?.user;
    return user ? { isSuccess: true, data: user } : { isSuccess: false, message: 'Please sign in again.', statusCode: 401 };
  },
};
export default mockAuthService;
