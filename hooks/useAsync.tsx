import LoaderCircular from '@/components/UI/LoaderCircular';
import { useState } from 'react';

export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  async function asyncFn<T>(fn: () => Promise<T>): Promise<T | undefined> {
    setLoading(true);
    setError(null);

    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err);
      console.error('Async error:', err);
    } finally {
      setLoading(false);
    }
  }

  const Loader = () => loading ? <LoaderCircular /> : null;
  return { asyncFn, loading, error, Loader };
}
