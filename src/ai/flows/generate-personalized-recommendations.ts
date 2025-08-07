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

const GeneratePersonalizedRecommendationsInputSchema = z.object({
  location: z.string().describe('The current location of the user.'),
  weather: z.string().describe('The current weather conditions at the user\'s location.'),
  preferences: z.string().describe('The user\'s stated preferences from the initial setup.'),
  learnedPreferences: z.string().describe('The user\'s inferred preferences learned over time.'),
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
  prompt: `You are a personal assistant that provides personalized recommendations for nearby activities and places based on the user\'s current location, the weather, their stated preferences from the initial setup, and their inferred preferences learned over time.\n\nCurrent Location: {{{location}}}\nWeather: {{{weather}}}\nPreferences: {{{preferences}}}\nLearned Preferences: {{{learnedPreferences}}}\n\nProvide a list of personalized recommendations for nearby activities and places. Consider the weather, the user's preferences, and the learned preferences when generating the recommendations. Be concise and provide a variety of options.\n`,
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
