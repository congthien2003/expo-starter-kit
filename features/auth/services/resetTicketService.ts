import { AppError } from '@/lib/errors';
let current: { ticket: string; email: string; expiresAt: number } | null = null;
export const resetTicketService = {
  issue(email: string, now = Date.now()): string {
    const ticket = `demo-${now}-${Math.random().toString(36).slice(2)}`;
    current = { ticket, email, expiresAt: now + 600000 };
    return ticket;
  },
  inspect(ticket: string, now = Date.now()): string {
    if (!current || current.ticket !== ticket || now >= current.expiresAt) throw new AppError('validation', 'This demo reset link is invalid or expired. Request another link.');
    return current.email;
  },
  consume(ticket: string, now = Date.now()): string {
    const email = this.inspect(ticket, now);
    current = null;
    return email;
  },
};
