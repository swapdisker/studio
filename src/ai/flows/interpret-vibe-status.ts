'use server';
/**
 * @fileOverview This file defines a Genkit flow to interpret the user's vibe status and return a recommendation.
 *
 * - interpretVibeStatus - A function that takes a vibe status as input and returns a recommendation.
 * - InterpretVibeStatusInput - The input type for the interpretVibeStatus function.
 * - InterpretVibeStatusOutput - The return type for the interpretVibeStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretVibeStatusInputSchema = z.object({
  vibeStatus: z.string().describe('The user selected vibe status.'),
});
export type InterpretVibeStatusInput = z.infer<typeof InterpretVibeStatusInputSchema>;

const InterpretVibeStatusOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A recommendation based on the vibe status.'),
});
export type InterpretVibeStatusOutput = z.infer<typeof InterpretVibeStatusOutputSchema>;

export async function interpretVibeStatus(input: InterpretVibeStatusInput): Promise<InterpretVibeStatusOutput> {
  return interpretVibeStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretVibeStatusPrompt',
  input: {schema: InterpretVibeStatusInputSchema},
  output: {schema: InterpretVibeStatusOutputSchema},
  prompt: `You are a recommendation expert that knows where the best places are depending on what the user feels like doing.

  The user has provided their vibe status.  Based on their vibe status, recommend a type of venue or activity that they might enjoy. Just suggest the type of activity, not any particular location.

Vibe Status: {{{vibeStatus}}} `,
});

const interpretVibeStatusFlow = ai.defineFlow(
  {
    name: 'interpretVibeStatusFlow',
    inputSchema: InterpretVibeStatusInputSchema,
    outputSchema: InterpretVibeStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
