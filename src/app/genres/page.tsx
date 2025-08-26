import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { mockGenres } from '@/lib/mock-data';

export default function GenresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Genres</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {mockGenres.map(genre => (
          <Link key={genre} href={`/category/${genre.toLowerCase()}`}>
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
