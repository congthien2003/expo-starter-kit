import { normalizeError } from './errors';
it('distinguishes timeout, cancellation, and unauthorized', () => {
  expect(normalizeError({ isAxiosError: true, code: 'ECONNABORTED' }).kind).toBe('timeout');
  expect(normalizeError({ isAxiosError: true, code: 'ERR_CANCELED' }).kind).toBe('cancelled');
  expect(normalizeError({ isAxiosError: true, response: { status: 401 } }).kind).toBe('unauthorized');
  expect(normalizeError(new Error('secret')).message).not.toContain('secret');
});
