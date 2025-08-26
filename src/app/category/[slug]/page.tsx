import { AnimeCard } from "@/components/anime/AnimeCard";
import { fetchZoro } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Anime } from "@/lib/types";

async function getGenres() {
    const res = await fetchZoro('genre/list');
    return res.map((g: any) => g.id);
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const slug = decodeURIComponent(params.slug);
    const allGenres = await getGenres();
    const validCategories = ['tv', 'movie', 'ova', 'ona', 'special', ...allGenres];
    
    if (!validCategories.includes(slug)) {
        notFound();
    }
    
    let animeRes;
    
    if (allGenres.includes(slug)) {
       animeRes = await fetchZoro(`genre/${slug}`);
    } else {
        animeRes = await fetchZoro(slug);
    }

    const filteredAnime: Anime[] = animeRes.results;

    const title = capitalize(slug);
    const description = `Browse all ${title} anime available on AniStream.`;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-headline font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">{description}</p>
            
            {filteredAnime && filteredAnime.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredAnime.map(anime => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </div>
            ) : (
                 <div className="col-span-full text-center text-muted-foreground py-16">
                    <p>No anime found for this category yet.</p>
                </div>
            )}
        </div>
    );
}
