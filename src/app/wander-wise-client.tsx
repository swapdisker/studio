'use client';

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import HappeningNowPanel from '@/components/panels/happening-now-panel';
import DestinationPanel from '@/components/panels/destination-panel';
import ChatPanel from '@/components/panels/chat-panel';
import Header from '@/components/layout/header';
import { generatePersonalizedRecommendations, GeneratePersonalizedRecommendationsOutput } from '@/ai/flows/generate-personalized-recommendations';
import { useToast } from '@/hooks/use-toast';

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

export interface Location {
    latitude: number;
    longitude: number;
    city?: string;
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
  const [selectedDestination, setSelectedDestination] = useState<GeneratePersonalizedRecommendationsOutput['recommendations'][0] | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [currentVibe, setCurrentVibe] = useState('Relaxed');
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Welcome!",
      description: "Ready to find your next adventure?",
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          
          // Eagerly fetch city from a simple query.
          generatePersonalizedRecommendations({
            query: "What city is this?",
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          }).then(result => {
            if (result.city) {
              setLocation(prevLocation => prevLocation ? {...prevLocation, city: result.city} : null);
            }
          }).catch(error => {
            console.error("Error fetching city:", error);
          });

        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            variant: "destructive",
            title: "Location Access Denied",
            description: "You can still manually provide your location in the chat.",
          });
        }
      );
    } else {
        toast({
            variant: "destructive",
            title: "Geolocation Not Supported",
            description: "Your browser does not support geolocation.",
        });
    }
  }, [toast]);


  const handleNewRecommendation = (recommendation: GeneratePersonalizedRecommendationsOutput['recommendations'][0] | null, city?: string) => {
    setSelectedDestination(recommendation);
    if (city && location && !location.city) {
        setLocation(prevLocation => prevLocation ? {...prevLocation, city: city} : null);
    }
  };

  const handleSelectMockDestination = (destinationId: number) => {
    const dest = mockDestinations.find(d => d.id === destinationId);
    if (dest) {
        const recommendation: GeneratePersonalizedRecommendationsOutput['recommendations'][0] = {
            name: dest.name,
            description: dest.description,
            weather: {
                temp: dest.weather.temp,
                condition: dest.weather.condition
            },
            traffic: "unknown",
            busyness: "unknown",
        };
        setSelectedDestination(recommendation);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <main className="grid grid-cols-[auto,auto,1fr] flex-1 overflow-hidden p-4 gap-4">
        <div className="row-span-2">
          <HappeningNowPanel 
            onSelectDestination={handleSelectMockDestination} 
            currentVibe={currentVibe}
            onVibeChange={setCurrentVibe}
          />
        </div>
        <div className={`row-span-2 transition-all duration-500 ease-in-out ${selectedDestination ? 'w-96' : 'w-0'} flex-shrink-0`}>
           {selectedDestination && <DestinationPanel destination={selectedDestination} />}
        </div>
        <div className="col-start-3 row-span-2 flex flex-col overflow-hidden rounded-lg border">
          <Header location={location} />
          <ChatPanel onNewRecommendation={handleNewRecommendation} location={location} vibe={currentVibe} />
        </div>
      </main>
    </div>
  );
};

export default WanderWiseClient;
