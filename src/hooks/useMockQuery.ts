import { useCallback, useEffect, useRef, useState } from 'react';

interface QueryState<T> { data?: T; loading: boolean; error?: string }

// Simulates an async request so screens already handle loading and error states.
// TODO(supabase): replace with real async queries (or TanStack Query) later.
export function useMockQuery<T>(key: string, fetcher: () => T, delayMs = 350) {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const [state, setState] = useState<QueryState<T>>({ loading: true });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    const timer = setTimeout(() => {
      try {
        const data = fetcherRef.current();
        if (active) setState({ data, loading: false });
      } catch (e) {
        if (active) setState({ loading: false, error: e instanceof Error ? e.message : 'Something went wrong' });
      }
    }, delayMs);
    return () => { active = false; clearTimeout(timer); };
  }, [key, nonce, delayMs]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, refetch };
}
