import { AnimeCarousel } from "@/components/anime/AnimeCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { fetchJikan } from "@/lib/utils";
import type { Anime } from "@/lib/types";

export default async function Home() {
  const topAnimeRes = await fetchJikan('top/anime', { filter: 'bypopularity', limit: '15' });
  const trendingAnime: Anime[] = topAnimeRes.data;

  const topAiringRes = await fetchJikan('top/anime', { filter: 'airing', limit: '15' });
  const topAiring: Anime[] = topAiringRes.data;
  
  const upcomingRes = await fetchJikan('top/anime', { filter: 'upcoming', limit: '15' });
  const upcoming: Anime[] = upcomingRes.data;

  const popularMoviesRes = await fetchJikan('top/anime', { filter: 'bypopularity', type: 'movie', limit: '15' });
  const popularMovies: Anime[] = popularMoviesRes.data;

  const heroAnime = trendingAnime[0];

  return (
    <div className="flex flex-col">
      {heroAnime && (
        <section className="relative w-full h-[50vh] md:h-[80vh] text-white">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
          <Image
            src={heroAnime.images.jpg.large_image_url}
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
                {heroAnime.synopsis}
              </p>
              <div className="mt-6 flex gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href={`/anime/${heroAnime.mal_id}`}>
                    <PlayCircle className="mr-2 h-6 w-6" />
                    Watch Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="bg-card/80 backdrop-blur-sm hover:bg-card">
                  <Link href={`/anime/${heroAnime.mal_id}`}>
                    More Info
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <div className="space-y-12 py-12">
        <AnimeCarousel title="Trending Now" animeList={trendingAnime} />
        <AnimeCarousel title="Top Airing" animeList={topAiring} />
        <AnimeCarousel title="Upcoming" animeList={upcoming} />
        <AnimeCarousel title="Popular Movies" animeList={popularMovies} />
      </div>
    </div>
  );
}
