import type { Video } from "@/types/video";
import { mockCategories } from "./categories";
import { mockCreators } from "./users";

const SOURCES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

const TITLES = [
  "Golden hour on the ridge",
  "60-second street noodles",
  "The commute nobody films",
  "I rebuilt my desk in a day",
  "This joke ruined my morning",
  "Monsoon rooftop sessions",
  "How I edit in 4 minutes",
  "Last light over the harbour",
  "Three ingredients, one pan",
  "Trail run, no music",
  "Tiny apartment, big plans",
  "Why I stopped scrolling",
];

const DESCRIPTIONS = [
  "Shot handheld, zero color grading. Sound on.",
  "Recipe in the comments, please stop asking me to write it down.",
  "Part 3 of the series. Part 4 lands Friday.",
  "Took two coffees and a lot of regret.",
  "Filmed this before the rain started. Barely made it.",
];

export const mockVideos: Video[] = Array.from({ length: 36 }, (_, i) => {
  const creator = mockCreators[i % mockCreators.length]!;
  const category = mockCategories[i % mockCategories.length]!;
  return {
    id: `v${i + 1}`,
    title: TITLES[i % TITLES.length]!,
    description: DESCRIPTIONS[i % DESCRIPTIONS.length]!,
    videoUrl: SOURCES[i % SOURCES.length]!,
    thumbnailUrl: `https://picsum.photos/seed/lumo${i}/720/1280`,
    duration: 15 + ((i * 7) % 45),
    views: 12000 + i * 4317,
    likes: 800 + i * 219,
    comments: 12 + ((i * 13) % 240),
    isLiked: false,
    isFollowing: creator.isFollowing,
    creator,
    category,
    createdAt: new Date(Date.now() - i * 7200_000).toISOString(),
  };
});
