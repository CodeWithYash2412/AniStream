import { AnimeCarousel } from "@/components/anime/AnimeCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { fetchZoro } from "@/lib/utils";
import type { Anime } from "@/lib/types";

export default async function Home() {
  const topAiringRes = await fetchZoro('top-airing');
  const topAiring: Anime[] = topAiringRes.results;

  const popularMoviesRes = await fetchZoro('movies');
  const popularMovies: Anime[] = popularMoviesRes.results;

  const mostPopularRes = await fetchZoro('most-popular');
  const mostPopular: Anime[] = mostPopularRes.results;
  
  const mostFavoriteRes = await fetchZoro('most-favorite');
  const mostFavorite: Anime[] = mostFavoriteRes.results;

  const heroAnime = topAiring[0];

  return (
    <div className="flex flex-col">
      {heroAnime && (
        <section className="relative w-full h-[50vh] md:h-[80vh] text-white">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
          <Image
            src={heroAnime.cover}
            alt={heroAnime.title}
            fill
            className="object-cover"
            data-ai-hint="anime hero background"
            priority
          />
          <div className="relative z-20 flex flex-col justify-end h-full p-4 md:p-8 lg:p-12">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-shadow-lg tracking-tight">
                {heroAnime.title}
              </h1>
              <p className="mt-4 text-sm md:text-base line-clamp-3 text-secondary-foreground/80">
                {heroAnime.description}
              </p>
              <div className="mt-6 flex gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href={`/anime/${heroAnime.id}`}>
                    <PlayCircle className="mr-2 h-6 w-6" />
                    Watch Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="bg-card/80 backdrop-blur-sm hover:bg-card">
                  <Link href={`/anime/${heroAnime.id}`}>
                    More Info
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <div className="space-y-12 py-12">
        <AnimeCarousel title="Top Airing" animeList={topAiring} />
        <AnimeCarousel title="Most Popular" animeList={mostPopular} />
        <AnimeCarousel title="Most Favorite" animeList={mostFavorite} />
        <AnimeCarousel title="Popular Movies" animeList={popularMovies} />
      </div>
    </div>
  );
}
