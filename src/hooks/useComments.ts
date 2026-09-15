import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/services/api/commentApi";
import type { Comment } from "@/types/comment";

export function useComments(videoId: string, enabled = true) {
  const qc = useQueryClient();
  const key = ["comments", videoId];

  const query = useQuery({
    queryKey: key,
    queryFn: () => commentApi.list(videoId),
    enabled,
  });

  const add = useMutation({
    mutationFn: (text: string) => commentApi.create(videoId, text),
    onSuccess: (comment) =>
      qc.setQueryData<Comment[]>(key, (prev) => [comment, ...(prev ?? [])]),
  });

  const remove = useMutation({
    mutationFn: (commentId: string) => commentApi.remove(commentId),
    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Comment[]>(key);
      qc.setQueryData<Comment[]>(key, (list) => (list ?? []).filter((c) => c.id !== commentId));
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
  });

  return { ...query, add, remove };
}
