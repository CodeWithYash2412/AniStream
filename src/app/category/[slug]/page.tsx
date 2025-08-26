import { AnimeCard } from "@/components/anime/AnimeCard";
import { fetchJikan } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Anime } from "@/lib/types";

async function getGenres() {
    const res = await fetchJikan('genres/anime');
    return res.data.map((g: any) => g.name.toLowerCase());
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const slug = decodeURIComponent(params.slug);
    const allGenres = await getGenres();
    const validCategories = ['tv', 'movie', 'ova', 'ona', 'special', ...allGenres];
    
    if (!validCategories.includes(slug)) {
        notFound();
    }
    
    let filterParams: Record<string,string> = { limit: '24' };
    
    if (allGenres.includes(slug)) {
        const genresRes = await fetchJikan('genres/anime');
        const genreId = genresRes.data.find((g: any) => g.name.toLowerCase() === slug)?.mal_id;
        if(genreId) {
            filterParams.genres = genreId.toString();
        }
    } else {
        filterParams.type = slug;
    }

    const animeRes = await fetchJikan('anime', filterParams);
    const filteredAnime: Anime[] = animeRes.data;

    const title = capitalize(slug.replace('-', ' '));
    const description = `Browse all ${title} anime available on AniStream.`;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-headline font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">{description}</p>
            
            {filteredAnime.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredAnime.map(anime => (
                        <AnimeCard key={anime.mal_id} anime={anime} />
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
