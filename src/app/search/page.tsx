import { AnimeCard } from "@/components/anime/AnimeCard";
import { fetchJikan } from "@/lib/utils";
import type { Anime } from "@/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = (searchParams?.q as string) || "";
  let filteredAnime: Anime[] = [];

  if (query) {
    const res = await fetchJikan('anime', { q: query, limit: '24' });
    filteredAnime = res.data;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline font-bold mb-2">Search Results</h1>
      {query ? (
        <p className="text-muted-foreground mb-8">
          Found {filteredAnime.length} results for &quot;{query}&quot;
        </p>
      ) : (
        <p className="text-muted-foreground mb-8">
          Please enter a search term to find anime.
        </p>
      )}

      {filteredAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAnime.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      ) : (
        query && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No results found. Try a different search term.</p>
          </div>
        )
      )}
    </div>
  );
}
