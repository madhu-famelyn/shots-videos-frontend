import type { Comment } from "@/types/comment";
import { mockCreators } from "./users";

const TEXTS = [
  "This is unreasonably good.",
  "Ok but where is this exactly?",
  "Saved. Trying this on the weekend.",
  "The sound design carries the whole thing.",
  "Third time watching, still funny.",
  "Been waiting for part 4 for a week now.",
  "How long did the edit take?",
];

export const mockComments: Comment[] = Array.from({ length: 42 }, (_, i) => ({
  id: `cm${i + 1}`,
  videoId: `v${(i % 12) + 1}`,
  user: mockCreators[i % mockCreators.length]!,
  text: TEXTS[i % TEXTS.length]!,
  likes: (i * 5) % 61,
  isLiked: false,
  isOwn: i % 9 === 0,
  createdAt: new Date(Date.now() - i * 1800_000).toISOString(),
}));
