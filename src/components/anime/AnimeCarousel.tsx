import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimeCard } from "./AnimeCard";
import type { Anime } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AnimeCarouselProps {
  title: string;
  animeList: any[];
  viewAllHref?: string;
}

export function AnimeCarousel({ title, animeList, viewAllHref }: AnimeCarouselProps) {
  if (!animeList || animeList.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-headline font-bold">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {animeList.map((anime) => (
            <CarouselItem key={anime.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <AnimeCard anime={anime} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>
    </section>
  );
}
