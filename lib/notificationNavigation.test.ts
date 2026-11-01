import { createNotificationNavigation, normalizeNotificationDate, parseNotificationDestination } from './notificationNavigation';
it('normalizes native seconds/milliseconds without granting invalid timestamps', () => {
  expect(normalizeNotificationDate(1790000000)).toBe(1790000000000);
  expect(normalizeNotificationDate(1790000000000)).toBe(1790000000000);
  expect(normalizeNotificationDate(NaN)).toBeNull();
});
it('only accepts allowlisted screen values', () => {
  expect(parseNotificationDestination({ screen: 'account' })).toBe('account');
  expect(parseNotificationDestination({ screen: 'https://evil.example' })).toBeNull();
  expect(parseNotificationDestination(null)).toBeNull();
});
it('holds until ready/authenticated, deduplicates and discards pending on logout', () => {
  const queue = createNotificationNavigation(); const navigate = jest.fn();
  queue.receive({ id: 'a', screen: 'account', receivedAt: 10 });
  queue.flush(false, true, navigate); expect(navigate).not.toHaveBeenCalled();
  queue.flush(true, true, navigate); expect(navigate).toHaveBeenCalledWith('account');
  queue.receive({ id: 'a', screen: 'account', receivedAt: 11 });
  queue.flush(true, true, navigate); expect(navigate).toHaveBeenCalledTimes(1);
  queue.receive({ id: 'b', screen: 'home', receivedAt: 12 }); queue.clear(13);
  queue.flush(true, true, navigate); expect(navigate).toHaveBeenCalledTimes(1);
  queue.receive({ id: 'late', screen: 'home', receivedAt: 12 });
  queue.flush(true, true, navigate); expect(navigate).toHaveBeenCalledTimes(1);
});
