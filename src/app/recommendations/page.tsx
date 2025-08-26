import { Sparkles } from 'lucide-react';
import { RecommendationClient } from './RecommendationClient';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <Sparkles className="mx-auto h-12 w-12 text-accent mb-4" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
          Personalized Anime Recommendations
        </h1>
        <p className="text-lg text-muted-foreground">
          Let our AI analyze your tastes to find the next anime you&apos;ll love. The more details you provide, the better the recommendations!
        </p>
      </div>
      
      <RecommendationClient />
    </div>
  );
}
