import { AnimeCard } from "@/components/anime/AnimeCard";
import { mockAnime, mockGenres } from "@/lib/mock-data";
import { notFound } from "next/navigation";

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const validCategories = ['tv', 'movies', 'ova', 'ona', 'special', 'completed', ...mockGenres.map(g => g.toLowerCase())];


export default function CategoryPage({ params }: { params: { slug: string } }) {
    const slug = decodeURIComponent(params.slug);
    
    if (!validCategories.includes(slug)) {
        notFound();
    }

    const filteredAnime = mockAnime.filter(anime => {
        if (slug === 'movies') return anime.type === 'Movie';
        if (slug === 'tv') return anime.type === 'TV';
        if (mockGenres.map(g => g.toLowerCase()).includes(slug)) {
            return anime.genres.map(g => g.toLowerCase()).includes(slug);
        }
        return anime.type.toLowerCase() === slug;
    });

    const title = capitalize(slug.replace('-', ' '));
    const description = `Browse all ${title} anime available on AniStream.`;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-headline font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">{description}</p>
            
            {filteredAnime.length > 0 ? (
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
