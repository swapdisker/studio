import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-recommendations.ts';
import '@/ai/flows/interpret-vibe-status.ts';
import '@/ai/flows/generate-quick-prompts.ts';
import '@/ai/tools/eventbrite.ts';
import '@/ai/tools/calendly.ts';
