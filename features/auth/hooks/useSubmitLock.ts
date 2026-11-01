import { useRef } from 'react';
// Covers the gap before React publishes RHF's isSubmitting update.
export function useSubmitLock(submit: () => Promise<void>): () => Promise<void> {
  const pending = useRef(false);
  return async () => {
    if (pending.current) return;
    pending.current = true;
    try { await submit(); } finally { pending.current = false; }
  };
}
