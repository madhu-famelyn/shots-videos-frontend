import { useCategories } from "@/hooks/useVideos";
import { cn } from "@/lib/utils";
import { useVideoStore } from "@/store/videoStore";

export function CategoryBar() {
  const { data: categories } = useCategories();
  const activeCategoryId = useVideoStore((s) => s.activeCategoryId);
  const setCategory = useVideoStore((s) => s.setCategory);

  if (!categories?.length) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-3 pt-14 md:pt-4">
      <div
        role="tablist"
        aria-label="Video categories"
        className="no-scrollbar pointer-events-auto flex max-w-full gap-2 overflow-x-auto rounded-full bg-black/40 p-1.5 backdrop-blur-md"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeCategoryId === null}
          onClick={() => setCategory(null)}
          className={cn(
            "min-h-9 shrink-0 rounded-full px-4 text-xs font-semibold text-white/80 transition",
            activeCategoryId === null && "bg-brand text-brand-foreground",
          )}
        >
          For you
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={activeCategoryId === c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              "min-h-9 shrink-0 rounded-full px-4 text-xs font-semibold text-white/80 transition",
              activeCategoryId === c.id && "bg-brand text-brand-foreground",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
