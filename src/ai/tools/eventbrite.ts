'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const getEventbriteEvents = ai.defineTool(
    {
      name: 'getEventbriteEvents',
      description: 'Get a list of events from Eventbrite based on a search query.',
      inputSchema: z.object({
        query: z.string().describe('The search query for events, e.g., "concerts in SF"'),
      }),
      outputSchema: z.object({
        events: z.array(
          z.object({
            name: z.string().optional(),
            summary: z.string().optional(),
            url: z.string().optional(),
          })
        ),
      }),
    },
    async (input) => {
      const apiKey = process.env.EVENTBRITE_API_KEY;
      if (!apiKey) {
        throw new Error('Eventbrite API key is not configured.');
      }
  
      const searchResponse = await fetch(`https://www.eventbriteapi.com/v3/events/search/?q=${input.query}&token=${apiKey}&expand=venue`);
      
      if (!searchResponse.ok) {
        console.error('Eventbrite API error:', await searchResponse.text());
        return { events: [] };
      }
  
      const searchData = await searchResponse.json();
  
      return {
        events: searchData.events.map((event: any) => ({
          name: event.name?.text,
          summary: event.summary,
          url: event.url,
        })),
      };
    }
);
