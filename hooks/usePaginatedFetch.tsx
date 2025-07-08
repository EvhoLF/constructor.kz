/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export interface UsePaginatedFetchhProps<T> {
  url: string;
  limit?: number;
  params?: Record<string, any>;
  enabled?: boolean;
  parseData?: (response: any) => T[]; // на случай вложенных данных
}

export function usePaginatedFetch<T>({ url, limit = 20, params = {}, enabled = true, parseData = (res) => res as T[], }: UsePaginatedFetchhProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    try {
      const config: AxiosRequestConfig = { params: { page, limit, ...params }, };
      const response = await axios.get(url, config);
      const newData = parseData(response.data);
      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error('Paginated fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [url, page, limit, params, loading, hasMore, enabled, parseData]);

  useEffect(() => { if (enabled && page === 0) loadMore(); }, [enabled, loadMore, page]);

  return { data, loading, hasMore, loadMore, reset, };
}
