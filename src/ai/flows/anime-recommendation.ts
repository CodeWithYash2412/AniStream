'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized anime recommendations.
 *
 * - animeRecommendation - A function that generates anime recommendations based on user viewing history and preferences.
 * - AnimeRecommendationInput - The input type for the animeRecommendation function.
 * - AnimeRecommendationOutput - The return type for the animeRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnimeRecommendationInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe(
      'A comma separated list of animes the user has watched, including titles and genres if possible.'
    ),
  preferences: z
    .string()
    .describe('A description of the user preferences and what they like in anime.'),
});
export type AnimeRecommendationInput = z.infer<typeof AnimeRecommendationInputSchema>;

const AnimeRecommendationOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of anime recommendations based on the user viewing history and preferences.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the anime recommendations provided.'),
  enoughData: z
    .boolean()
    .describe('Whether or not there was enough information to make a recommendation.'),
});
export type AnimeRecommendationOutput = z.infer<typeof AnimeRecommendationOutputSchema>;

export async function animeRecommendation(input: AnimeRecommendationInput): Promise<AnimeRecommendationOutput> {
  return animeRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'animeRecommendationPrompt',
  input: {schema: AnimeRecommendationInputSchema},
  output: {schema: AnimeRecommendationOutputSchema},
  prompt: `You are an AI anime recommendation expert.

You will provide a list of anime recommendations based on the user's viewing history and stated preferences.

Also, include a brief explanation of why each anime was recommended.

If there isn't enough data, set enoughData to false and explain what data you need.

Viewing History: {{{viewingHistory}}}
Preferences: {{{preferences}}}
`,
});

const animeRecommendationFlow = ai.defineFlow(
  {
    name: 'animeRecommendationFlow',
    inputSchema: AnimeRecommendationInputSchema,
    outputSchema: AnimeRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
