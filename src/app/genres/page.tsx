import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { fetchZoro } from '@/lib/utils';

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
}

export default async function GenresPage() {
  const genres: string[] = await fetchZoro('genre/list');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Genres</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {genres.map((genre: string) => (
          <Link key={genre} href={`/category/${encodeURIComponent(genre)}`}>
            <Badge 
              variant="secondary" 
              className="text-lg py-3 px-6 rounded-full cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {capitalize(genre)}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
