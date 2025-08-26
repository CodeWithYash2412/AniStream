import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import type { Anime } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`} className={cn("group block relative", className)}>
      <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-card shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105">
        <Image
          src={anime.poster}
          alt={anime.title}
          width={400}
          height={600}
          data-ai-hint="anime poster"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <PlayCircle className="h-16 w-16 text-white/80 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-lg font-bold drop-shadow-md opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {anime.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
