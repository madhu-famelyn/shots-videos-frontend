import { useCallback, useEffect, useRef, useState } from "react";
import { videoApi } from "@/services/api/videoApi";

/** Throttle window for progress reporting — never one request per frame. */
const PROGRESS_INTERVAL_MS = 5000;

export function useVideoAnalytics(videoId: string) {
  const started = useRef(false);
  const completed = useRef(false);
  const lastSent = useRef(0);

  useEffect(() => {
    started.current = false;
    completed.current = false;
    lastSent.current = 0;
  }, [videoId]);

  const onProgress = useCallback(
    (progress: number) => {
      const now = Date.now();
      if (!started.current) {
        started.current = true;
        void videoApi.trackEvent(videoId, "video_started", progress);
        lastSent.current = now;
        return;
      }
      if (now - lastSent.current < PROGRESS_INTERVAL_MS) return;
      lastSent.current = now;
      void videoApi.trackEvent(videoId, "video_progress", progress);
    },
    [videoId],
  );

  const onComplete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    void videoApi.trackEvent(videoId, "video_completed", 1);
  }, [videoId]);

  return { onProgress, onComplete };
}

/** Tracks which feed item is centred in the viewport using IntersectionObserver. */
export function useActiveItem(count: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset["index"]);
          if (Number.isNaN(idx)) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index: idx, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.6) setActiveIndex(best.index);
      },
      { root, threshold: [0, 0.25, 0.6, 0.9] },
    );
    itemRefs.current.slice(0, count).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  return { activeIndex, containerRef, setItemRef, itemRefs };
}
