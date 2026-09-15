import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Loading } from "@/components/common/Loading";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useVideos";
import { formatCount } from "@/lib/format";
import { userApi } from "@/services/api/userApi";
import { useUserStore } from "@/store/userStore";
import { useVideoStore } from "@/store/videoStore";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    const q = typeof search["q"] === "string" ? search["q"].slice(0, 120) : "";
    return q ? { q } : {};
  },
  head: () => ({
    meta: [
      { title: "Search videos and creators — Reeltide" },
      {
        name: "description",
        content: "Find short videos, creators and categories across Reeltide.",
      },
      { property: "og:title", content: "Search videos and creators — Reeltide" },
      { property: "og:description", content: "Search the Reeltide catalogue." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState(q);
  const [debounced, setDebounced] = useState(q);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useUserStore();
  const { data: categories } = useCategories();
  const setCategory = useVideoStore((s) => s.setCategory);

  useEffect(() => setTerm(q), [q]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(term);
      if (term.trim()) addRecentSearch(term);
      void navigate({ to: "/search", search: term ? { q: term } : {}, replace: true });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const query = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => userApi.search(debounced),
    enabled: debounced.trim().length > 0,
  });

  const results = query.data;
  const hasResults =
    !!results &&
    results.videos.length + results.creators.length + results.categories.length > 0;

  return (
    <AuthGate>
      <AppShell title="Search">
        <div className="relative mb-6">
          <SearchIcon
            className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search videos, creators, categories"
            aria-label="Search"
            className="min-h-12 rounded-full bg-secondary pl-11"
          />
          {term ? (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 grid min-h-11 min-w-11 -translate-y-1/2 place-items-center rounded-full text-muted-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        {debounced.trim().length === 0 ? (
          <div className="space-y-8">
            {recentSearches.length > 0 ? (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Recent searches</h2>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTerm(r)}
                      className="min-h-9 rounded-full bg-secondary px-4 text-sm"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="mb-3 text-sm font-semibold">Browse categories</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {categories?.map((c) => (
                  <Link
                    key={c.id}
                    to="/feed"
                    onClick={() => setCategory(c.id)}
                    className="group relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src={c.thumbnail}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition group-hover:scale-105"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-black/45 font-display text-sm font-bold text-white">
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ) : query.isLoading ? (
          <Loading label="Searching" />
        ) : query.isError ? (
          <ErrorState message={(query.error as Error).message} onRetry={() => void query.refetch()} />
        ) : !hasResults ? (
          <EmptyState
            icon={SearchIcon}
            title="No results"
            message={`Nothing matched “${debounced}”. Try a different word.`}
          />
        ) : (
          <div className="space-y-8">
            {results.creators.length > 0 ? (
              <section>
                <h2 className="mb-3 text-sm font-semibold">Creators</h2>
                <ul className="space-y-2">
                  {results.creators.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-card p-3">
                      <Avatar src={c.avatar} name={c.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{c.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          @{c.username} · {formatCount(c.followers)} followers
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.videos.length > 0 ? (
              <section>
                <h2 className="mb-3 text-sm font-semibold">Videos</h2>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {results.videos.map((v) => (
                    <li key={v.id}>
                      <Link
                        to="/video/$id"
                        params={{ id: v.id }}
                        className="group block overflow-hidden rounded-2xl bg-card"
                      >
                        <img
                          src={v.thumbnailUrl}
                          alt=""
                          loading="lazy"
                          className="aspect-[9/16] w-full object-cover transition group-hover:opacity-90"
                        />
                        <span className="block truncate p-2 text-xs font-medium">{v.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.categories.length > 0 ? (
              <section>
                <h2 className="mb-3 text-sm font-semibold">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map((c) => (
                    <Link
                      key={c.id}
                      to="/feed"
                      onClick={() => setCategory(c.id)}
                      className="min-h-9 rounded-full bg-secondary px-4 py-2 text-sm"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </AppShell>
    </AuthGate>
  );
}
