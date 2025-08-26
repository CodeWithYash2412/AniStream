import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { fetchJikan } from '@/lib/utils';

export default async function GenresPage() {
  const genresRes = await fetchJikan('genres/anime');
  const genres = genresRes.data.map((g: any) => g.name);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Genres</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {genres.map((genre: string) => (
          <Link key={genre} href={`/category/${genre.toLowerCase().replace(' ', '-')}`}>
            <Badge 
              variant="secondary" 
              className="text-lg py-3 px-6 rounded-full cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {genre}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
