import { useQuery } from "@tanstack/react-query";
import { videoApi } from "@/services/api/videoApi";

export function useVideo(id: string) {
  return useQuery({ queryKey: ["video", id], queryFn: () => videoApi.getById(id) });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => videoApi.getCategories() });
}
