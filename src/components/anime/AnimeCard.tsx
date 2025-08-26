import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Star } from "lucide-react";
import type { Anime, SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  anime: Anime | SearchResult;
  className?: string;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`} className={cn("group block relative", className)}>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-primary/20">
        <Image
          src={anime.image}
          alt={anime.title}
          width={400}
          height={600}
          data-ai-hint="anime poster"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <PlayCircle className="h-20 w-20 text-white/80 drop-shadow-lg" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-base font-bold drop-shadow-md line-clamp-2">
            {anime.title}
          </h3>
           <p className="text-xs text-muted-foreground mt-1">{anime.type} • {anime.releaseDate}</p>
        </div>
      </div>
    </Link>
  );
}
