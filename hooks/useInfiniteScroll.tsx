// hooks/useInfiniteScroll.ts
import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (onLoadMore: () => void, hasMore: boolean, loading: boolean) => {
    const observerRef = useRef<IntersectionObserver>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sentinelRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(sentinelRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading, onLoadMore]);

    return { sentinelRef };
};