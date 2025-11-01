// hooks/useLazyDiagramLoad.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { SuperTemplate } from '@/types/diagrams';
import axiosClient from '@/libs/axiosClient';

interface UseLazyDiagramLoadProps {
  api: string;
  searchQuery: string;
  pageSize?: number;
}

interface PaginatedResponse {
  data: SuperTemplate[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// hooks/useLazyDiagramLoad.ts
export const useLazyDiagramLoad = ({
  api,
  searchQuery,
  pageSize = 20
}: UseLazyDiagramLoadProps) => {
  const { asyncFn } = useAsync();
  const [items, setItems] = useState<SuperTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadingRef = useRef(false);
  const prevApiRef = useRef(api);
  const prevSearchQueryRef = useRef(searchQuery);

  // Стабильная функция загрузки данных
  const loadData = useCallback(async (pageNum: number, isSearch: boolean = false) => {
    // Добавляем проверку на пустой API
    if (loadingRef.current || !api) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const params: Record<string, string | number> = {
        page: pageNum,
        limit: pageSize
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      const res = await asyncFn(() =>
        axiosClient.get(api, { params })
      );

      if (res?.data) {
        let responseData: SuperTemplate[];
        let responseHasMore: boolean;

        if (Array.isArray(res.data)) {
          responseData = res.data;
          responseHasMore = responseData.length === pageSize;
        } else {
          const paginatedResponse = res.data as PaginatedResponse;
          responseData = paginatedResponse.data || [];
          responseHasMore = paginatedResponse.hasMore !== undefined
            ? paginatedResponse.hasMore
            : (paginatedResponse.page * paginatedResponse.limit) < paginatedResponse.total;
        }

        if (isSearch) {
          setItems(responseData);
        } else {
          setItems(prev => [...prev, ...responseData]);
        }

        setHasMore(responseHasMore);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error loading diagrams:', error);
      // Сбрасываем состояние при ошибке
      if (isSearch) {
        setItems([]);
        setHasMore(false);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [api, searchQuery, pageSize, asyncFn]);

  // Основной эффект для загрузки данных при изменении API или поискового запроса
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Проверяем, действительно ли изменились параметры
    const apiChanged = prevApiRef.current !== api;
    const searchChanged = prevSearchQueryRef.current !== searchQuery;

    if ((apiChanged || searchChanged) && api) { // Добавляем проверку на api
      prevApiRef.current = api;
      prevSearchQueryRef.current = searchQuery;

      const performSearch = () => {
        if (!isMounted || !api) return;

        // Сбрасываем состояние только если API изменился или это новый поиск
        if (apiChanged || searchQuery !== '') {
          setItems([]);
          setPage(1);
          setHasMore(true);
        }

        loadingRef.current = false;
        loadData(1, true);
      };

      // Дебаунс для поиска
      timeoutId = setTimeout(performSearch, 300);
    } else if (apiChanged && !api) {
      // Если API стал пустым, сбрасываем данные
      setItems([]);
      setHasMore(false);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [api, searchQuery, loadData]);

  // Остальной код без изменений...
  const loadNextPage = useCallback(() => {
    if (!loadingRef.current && hasMore && api) { // Добавляем проверку на api
      loadData(page + 1, false);
    }
  }, [hasMore, page, loadData, api]);

  const refresh = useCallback(() => {
    if (!api) return; // Проверяем API
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadingRef.current = false;
    loadData(1, true);
  }, [loadData, api]);

  return {
    items,
    loading,
    hasMore,
    loadNextPage,
    refresh
  };
};