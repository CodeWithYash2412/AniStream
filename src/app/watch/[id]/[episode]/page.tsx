import { fetchZoro } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ListVideo,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Anime, Episode } from "@/lib/types";

export default async function WatchPage({ params }: { params: { id: string, episode: string } }) {
  const animeRes = await fetchZoro(`info`, { id: params.id });
  const anime: Anime = animeRes;
  
  const episodes: Episode[] = anime.episodes || [];

  if (!anime || !episodes || episodes.length === 0) {
    notFound();
  }

  const currentEpisode = episodes.find(e => e.id === params.episode);
  
  if (!currentEpisode) {
    notFound();
  }
  
  const currentIndex = episodes.findIndex(e => e.id === currentEpisode.id);
  
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;
  const prevEpisode = hasPrev ? episodes[currentIndex - 1] : null;
  const nextEpisode = hasNext ? episodes[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      <div className="flex-grow flex flex-col p-4">
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-muted-foreground mb-4">
          <p>Anime Video Player Placeholder</p>
        </div>
        <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-2xl font-bold font-headline">{anime.title}</h1>
                <h2 className="text-lg text-muted-foreground">E{currentEpisode.number}: {currentEpisode.title || `Episode ${currentEpisode.number}`}</h2>
            </div>
            <div className="flex gap-2">
            <Button asChild variant="outline" disabled={!hasPrev}>
                <Link href={prevEpisode ? `/watch/${anime.id}/${prevEpisode.id}` : '#'}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Prev
                </Link>
            </Button>
            <Button asChild variant="outline" disabled={!hasNext}>
                <Link href={nextEpisode ? `/watch/${anime.id}/${nextEpisode.id}` : '#'}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            </div>
        </div>
        <div>
            <h3 className="text-xl font-bold mb-2">Description</h3>
            <p className="text-muted-foreground text-sm">{anime.description}</p>
        </div>
      </div>
      <aside className="w-full lg:w-96 lg:border-l border-t lg:border-t-0 p-4 shrink-0">
        <h3 className="text-xl font-bold font-headline mb-4 flex items-center"><ListVideo className="mr-2"/> Episodes</h3>
        <ScrollArea className="h-[calc(100vh-14rem)] lg:h-[calc(100vh-9rem)]">
            <div className="space-y-2 pr-4">
                {episodes.map(ep => (
                    <Link key={ep.id} href={`/watch/${anime.id}/${ep.id}`}>
                        <div className={cn(
                            "flex gap-4 p-2 rounded-lg transition-colors hover:bg-card",
                            ep.id === currentEpisode.id && "bg-card"
                        )}>
                            <Image src={ep.image || anime.image} alt={ep.title || `Episode ${ep.number}`} width={128} height={72} className="rounded aspect-video object-cover" data-ai-hint="episode thumbnail" />
                            <div>
                                <p className="font-semibold text-sm">E{ep.number}: {ep.title || `Episode ${ep.number}`}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
