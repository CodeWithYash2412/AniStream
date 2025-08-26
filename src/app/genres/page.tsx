import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { fetchZoro } from '@/lib/utils';

export default async function GenresPage() {
  const genres = await fetchZoro('genre/list');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Genres</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {genres.map((genre: {id: string, title: string}) => (
          <Link key={genre.id} href={`/category/${genre.id}`}>
            <Badge 
              variant="secondary" 
              className="text-lg py-3 px-6 rounded-full cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {genre.title}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
