import { resetTicketService } from './resetTicketService';
it('expires at ten minutes and only consumes once', () => {
  const token = resetTicketService.issue('demo@example.com', 1000);
  expect(() => resetTicketService.consume(token, 601000)).toThrow();
  const next = resetTicketService.issue('demo@example.com', 1000);
  expect(resetTicketService.consume(next, 1001)).toBe('demo@example.com');
  expect(() => resetTicketService.consume(next, 1002)).toThrow();
});
it('replaces old tickets and rejects arbitrary deep-link tickets', () => {
  const old = resetTicketService.issue('demo@example.com');
  resetTicketService.issue('demo@example.com');
  expect(() => resetTicketService.consume(old)).toThrow();
  expect(() => resetTicketService.consume('external')).toThrow();
});
