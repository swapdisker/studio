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
  latitude: z.number().optional().describe("The user's latitude."),
  longitude: z.number().optional().describe("The user's longitude."),
});
export type GeneratePersonalizedRecommendationsInput = z.infer<typeof GeneratePersonalizedRecommendationsInputSchema>;

const RecommendationSchema = z.object({
    name: z.string().describe("The name of the recommended place or event."),
    description: z.string().describe("A brief description of the recommendation."),
    weather: z.object({
        temp: z.number().describe("The temperature in Celsius."),
        condition: z.enum(['sunny', 'cloudy', 'rainy']).describe("The weather condition."),
    }).describe("The weather at the recommended location."),
    traffic: z.string().optional().describe("The current traffic conditions to the location (e.g., 'light', 'moderate', 'heavy')."),
    busyness: z.string().optional().describe("How busy the location is currently (e.g., 'not busy', 'moderately busy', 'very busy')."),
});

const GeneratePersonalizedRecommendationsOutputSchema = z.object({
  city: z.string().optional().describe("The user's city, derived from the provided latitude and longitude."),
  recommendations: z.array(RecommendationSchema).describe('A list of personalized recommendations for nearby activities and places.'),
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
{{#if latitude}}The user is at latitude: {{{latitude}}} and longitude: {{{longitude}}}. Based on these coordinates, determine the user's city and populate the 'city' field in the output.{{/if}}

Based on the user's request and location (if provided), provide a list of personalized recommendations for nearby activities and places.
- For each recommendation, provide a name, description, and fake but realistic weather. 
- For traffic and busyness, you can leave them as "unknown" for now.
- Use the available tools to find real events and venues if the user asks for something specific like "concerts".
- If the user provides a location in their query, prioritize that over the latitude/longitude data.
- If no location data is available at all, you can ask the user for their location.
- Return at least 3 recommendations.
- Be creative and provide interesting options.`,
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
