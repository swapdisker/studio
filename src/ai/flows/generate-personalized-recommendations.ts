'use server';
/**
 * @fileOverview A personalized recommendation AI agent.
 *
 * - generatePersonalizedRecommendations - A function that handles the personalized recommendation process.
 * - GeneratePersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - GeneratePersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getEventbriteEvents } from '../tools/eventbrite';

const GeneratePersonalizedRecommendationsInputSchema = z.object({
  query: z.string().describe('The user\'s request for recommendations.'),
});
export type GeneratePersonalizedRecommendationsInput = z.infer<typeof GeneratePersonalizedRecommendationsInputSchema>;

const GeneratePersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('A list of personalized recommendations for nearby activities and places.'),
});
export type GeneratePersonalizedRecommendationsOutput = z.infer<typeof GeneratePersonalizedRecommendationsOutputSchema>;

export async function generatePersonalizedRecommendations(input: GeneratePersonalizedRecommendationsInput): Promise<GeneratePersonalizedRecommendationsOutput> {
  return generatePersonalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedRecommendationsPrompt',
  input: {schema: GeneratePersonalizedRecommendationsInputSchema},
  output: {schema: GeneratePersonalizedRecommendationsOutputSchema},
  prompt: `You are a personal assistant that provides personalized recommendations for nearby activities and places.

The user's request is: {{{query}}}

Based on the user's request, provide a list of personalized recommendations for nearby activities and places. Be concise and provide a variety of options. Use the available tools to find real events and venues.`,
  tools: [getEventbriteEvents],
});

const generatePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRecommendationsFlow',
    inputSchema: GeneratePersonalizedRecommendationsInputSchema,
    outputSchema: GeneratePersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
