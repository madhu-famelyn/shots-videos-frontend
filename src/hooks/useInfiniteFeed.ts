import { useCallback, useEffect, useRef } from "react";
import { videoApi } from "@/services/api/videoApi";
import { useVideoStore } from "@/store/videoStore";

const PAGE_SIZE = 5;

/**
 * Paginated feed loader. Never loads the whole catalogue: it fetches one page
 * at a time and only when the viewer approaches the end of the list.
 */
export function useInfiniteFeed() {
  const { feed, page, hasMore, loading, error, activeCategoryId } = useVideoStore();
  const { appendFeed, setPagination, setLoading, setError } = useVideoStore();
  const inFlight = useRef(false);

  const loadMore = useCallback(async () => {
    if (inFlight.current) return;
    const state = useVideoStore.getState();
    if (!state.hasMore) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const next = state.page + 1;
      const res = await videoApi.getFeed({
        page: next,
        limit: PAGE_SIZE,
        ...(state.activeCategoryId ? { categoryId: state.activeCategoryId } : {}),
      });
      appendFeed(res.items);
      setPagination({ page: next, hasMore: res.hasMore });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, [appendFeed, setPagination, setLoading, setError]);

  useEffect(() => {
    if (useVideoStore.getState().feed.length === 0) void loadMore();
  }, [loadMore, activeCategoryId]);

  const retry = useCallback(() => {
    void loadMore();
  }, [loadMore]);

  return { feed, page, hasMore, loading, error, loadMore, retry };
}
