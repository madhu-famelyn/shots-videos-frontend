import type { Creator } from "./user";

export interface Comment {
  id: string;
  videoId: string;
  user: Creator;
  text: string;
  likes: number;
  isLiked: boolean;
  isOwn: boolean;
  createdAt: string;
}
