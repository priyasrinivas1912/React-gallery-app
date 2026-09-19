import { useCallback, useState } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  limit?: number;
  fetchFn: (page: number, isRefresh: boolean) => Promise<void>;
}

export function usePagination({
  initialPage = 1,
  fetchFn,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    try {
      await fetchFn(1, true);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFn]);

  const onEndReached = useCallback(async () => {
    if (isLoadingMore || isRefreshing) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    try {
      await fetchFn(nextPage, false);
      setCurrentPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, fetchFn, isLoadingMore, isRefreshing]);

  return {
    currentPage,
    isRefreshing,
    isLoadingMore,
    onRefresh,
    onEndReached,
  };
}
