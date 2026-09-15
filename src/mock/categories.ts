import type { Category } from "@/types/category";

const thumb = (seed: string) => `https://picsum.photos/seed/${seed}/300/300`;

export const mockCategories: Category[] = [
  { id: "c1", name: "Entertainment", thumbnail: thumb("entertain") },
  { id: "c2", name: "Food", thumbnail: thumb("food") },
  { id: "c3", name: "Travel", thumbnail: thumb("travel") },
  { id: "c4", name: "Lifestyle", thumbnail: thumb("lifestyle") },
  { id: "c5", name: "Comedy", thumbnail: thumb("comedy") },
  { id: "c6", name: "News", thumbnail: thumb("news") },
  { id: "c7", name: "Technology", thumbnail: thumb("tech") },
  { id: "c8", name: "Sports", thumbnail: thumb("sports") },
];
