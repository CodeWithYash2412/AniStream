'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { animeRecommendation, type AnimeRecommendationOutput } from '@/ai/flows/anime-recommendation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  viewingHistory: z.string().min(10, {
    message: 'Please list at least one anime you have watched.',
  }),
  preferences: z.string().min(10, {
    message: 'Please describe your preferences in a bit more detail.',
  }),
});

export function RecommendationClient() {
  const { toast } = useToast();
  const [result, setResult] = useState<AnimeRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      viewingHistory: '',
      preferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await animeRecommendation(values);
      setResult(res);
      toast({
        title: "Recommendations Ready!",
        description: "We've found some new anime for you.",
      });
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with our AI. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Tell Us What You Like</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="viewingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Viewing History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Attack on Titan (Action, Dark Fantasy), Spy x Family (Comedy, Slice of Life), Cowboy Bebop (Sci-Fi, Adventure)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List some anime you&apos;ve watched, including genres if you know them.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love fast-paced action with complex characters. I dislike romance-heavy plots but enjoy a good mystery. Looking for something with a unique art style."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what you enjoy in an anime. What genres, themes, or character types do you prefer?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" /> Get Recommendations</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your AI-Powered Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.enoughData ? (
                <>
                    <div>
                        <h3 className="text-lg font-semibold flex items-center mb-2"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />Reasoning</h3>
                        <p className="text-muted-foreground prose prose-invert">{result.reasoning}</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                        <div className="text-muted-foreground prose prose-invert whitespace-pre-wrap">{result.recommendations}</div>
                    </div>
                </>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg font-semibold mb-2">Not enough data to make a recommendation.</p>
                <p className="text-muted-foreground">{result.reasoning}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
