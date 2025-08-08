'use server';

import { z } from 'zod';

const CalendlyEventSchema = z.object({
  uri: z.string(),
  name: z.string(),
  start_time: z.string(),
  end_time: z.string(),
});

export type CalendlyEvent = z.infer<typeof CalendlyEventSchema>;

const USER_URI = "https://api.calendly.com/users/43e3adab-2568-44fd-895d-078d6c613ac9";

export async function getCalendlyEvents(): Promise<CalendlyEvent[]> {
  const apiKey = process.env.CALENDLY_API_KEY;
  if (!apiKey) {
    throw new Error('Calendly API key is not configured.');
  }

  const response = await fetch(`https://api.calendly.com/scheduled_events?user=${USER_URI}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Calendly API error:', await response.text());
    return [];
  }

  const data = await response.json();
  
  return data.collection.map((event: any) => ({
    uri: event.uri,
    name: event.name,
    start_time: event.start_time,
    end_time: event.end_time,
  }));
}
