import { fetchZoro } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Tv, Film, Play, ListVideo } from "lucide-react";
import Link from "next/link";
import { AnimeCard } from "@/components/anime/AnimeCard";
import type { Anime, Episode } from "@/lib/types";

export default async function AnimeDetailPage({ params }: { params: { id: string } }) {
  const animeRes = await fetchZoro(`info`, { id: params.id });
  const anime: Anime = animeRes;

  if (!anime || !anime.id) {
    notFound();
  }

  const recommendationsRes = await fetchZoro('most-popular');
  const recommendedAnime = recommendationsRes.results.slice(0, 5);

  const episodes: Episode[] = anime.episodes || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4">
          <Image
            src={anime.image}
            alt={anime.title}
            width={400}
            height={600}
            className="rounded-lg shadow-2xl w-full"
            data-ai-hint="anime poster"
          />
        </div>
        <div className="md:w-2/3 lg:w-3/4">
          <Badge variant="secondary" className="mb-2">{anime.type}</Badge>
          <h1 className="text-4xl lg:text-5xl font-headline font-bold mb-2">
            {anime.title}
          </h1>
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <span>{anime.status}</span>
             <span>•</span>
            <span>{anime.totalEpisodes || '?'} Episodes</span>
          </div>
          <p className="text-muted-foreground mb-6">{anime.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genres.map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg" disabled={episodes.length === 0}>
              <Link href={episodes.length > 0 ? `/watch/${anime.id}/${episodes[0].id}` : '#'}>
                <Play className="mr-2 h-5 w-5" />
                Watch Episode 1
              </Link>
            </Button>
            <Button variant="secondary" size="lg">
              <ListVideo className="mr-2 h-5 w-5" />
              Add to My List
            </Button>
          </div>
        </div>
      </div>

      {episodes && episodes.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-headline font-bold mb-6">Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {episodes.map(ep => (
                  <Link key={ep.id} href={`/watch/${anime.id}/${ep.id}`}>
                      <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
                          <CardContent className="p-0">
                              <div className="relative aspect-video">
                                  <Image src={ep.image || anime.image} alt={ep.title || `Episode ${ep.number}`} layout="fill" className="object-cover" data-ai-hint="anime episode thumbnail" />
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Play className="w-10 h-10 text-white"/>
                                  </div>
                              </div>
                              <div className="p-4">
                                  <p className="font-semibold truncate">E{ep.number}: {ep.title || `Episode ${ep.number}`}</p>
                              </div>
                          </CardContent>
                      </Card>
                  </Link>
              ))}
          </div>
        </div>
      )}


       {recommendedAnime && recommendedAnime.length > 0 && (
          <div className="mt-12">
              <h2 className="text-3xl font-headline font-bold mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendedAnime.map(rec => <AnimeCard key={rec.id} anime={rec} />)}
              </div>
          </div>
       )}
    </div>
  );
}
