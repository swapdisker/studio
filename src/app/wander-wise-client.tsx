'use client';

import { useState } from 'react';
import type { FC } from 'react';
import HappeningNowPanel from '@/components/panels/happening-now-panel';
import DestinationPanel from '@/components/panels/destination-panel';
import ChatPanel from '@/components/panels/chat-panel';
import Header from '@/components/layout/header';

export interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  aiHint: string;
  weather: {
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rainy';
  };
}

const mockDestinations: Destination[] = [
  {
    id: 1,
    name: 'Museum of Modern Art',
    description: 'Explore iconic works of modern and contemporary art. A perfect quiet afternoon activity for a relaxed vibe.',
    image: 'https://placehold.co/600x400',
    aiHint: 'museum art',
    weather: { temp: 22, condition: 'cloudy' },
  },
  {
    id: 2,
    name: 'City Park Bandshell',
    description: 'A vibrant outdoor venue with live music events. Ideal for an energetic evening.',
    image: 'https://placehold.co/600x400',
    aiHint: 'concert park',
    weather: { temp: 24, condition: 'sunny' },
  },
];

const WanderWiseClient: FC = () => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleSelectDestination = (destinationId: number) => {
    const dest = mockDestinations.find(d => d.id === destinationId);
    setSelectedDestination(dest || null);
  };
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        <HappeningNowPanel onSelectDestination={handleSelectDestination} />
        <div className={`transition-all duration-500 ease-in-out ${selectedDestination ? 'w-96' : 'w-0'} flex-shrink-0`}>
           {selectedDestination && <DestinationPanel destination={selectedDestination} />}
        </div>
        <ChatPanel onSelectDestination={handleSelectDestination}/>
      </main>
    </div>
  );
};

export default WanderWiseClient;
