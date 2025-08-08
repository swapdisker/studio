'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate quick prompts based on a vibe.
 *
 * - generateQuickPrompts - A function that takes a vibe as input and returns a list of prompts.
 * - GenerateQuickPromptsInput - The input type for the generateQuickPrompts function.
 * - GenerateQuickPromptsOutput - The return type for the generateQuickPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuickPromptsInputSchema = z.object({
  vibe: z.string().describe('The user selected vibe.'),
});
export type GenerateQuickPromptsInput = z.infer<typeof GenerateQuickPromptsInputSchema>;

const GenerateQuickPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).length(4).describe('A list of 4 short, interesting, and diverse quick action prompts for the user based on their vibe.'),
});
export type GenerateQuickPromptsOutput = z.infer<typeof GenerateQuickPromptsOutputSchema>;

export async function generateQuickPrompts(input: GenerateQuickPromptsInput): Promise<GenerateQuickPromptsOutput> {
  return generateQuickPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuickPromptsPrompt',
  input: {schema: GenerateQuickPromptsInputSchema},
  output: {schema: GenerateQuickPromptsOutputSchema},
  prompt: `You are a creative assistant that generates conversation starters. 
  
  Based on the user's current vibe, suggest four diverse and interesting questions they could ask a travel assistant. 
  These prompts should be short, like "Find a quiet coffee shop" or "Any live music tonight?".

  Vibe: {{{vibe}}}`,
});

const generateQuickPromptsFlow = ai.defineFlow(
  {
    name: 'generateQuickPromptsFlow',
    inputSchema: GenerateQuickPromptsInputSchema,
    outputSchema: GenerateQuickPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
