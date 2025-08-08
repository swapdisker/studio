'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WeatherWidget from '@/components/common/weather-widget';
import type { GeneratePersonalizedRecommendationsOutput } from '@/ai/flows/generate-personalized-recommendations';
import { TrafficCone, Users, CalendarPlus } from 'lucide-react';
import { scheduleEvent } from '@/ai/tools/calendly';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { format } from 'date-fns';

interface DestinationPanelProps {
  destination: GeneratePersonalizedRecommendationsOutput['recommendations'][0];
  onEventScheduled: () => void;
}

const DestinationPanel = ({ destination, onEventScheduled }: DestinationPanelProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";
  const { toast } = useToast();
  const [isScheduling, setIsScheduling] = useState(false);
  
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(destination.name)}`;

  const handleSchedule = async () => {
    setIsScheduling(true);
    toast({
      title: 'Scheduling...',
      description: `Finding the next available slot for ${destination.name}.`,
    });
    try {
      const result = await scheduleEvent(destination.name, destination.description);
      if (result.success && result.scheduledTime) {
        const scheduledDate = new Date(result.scheduledTime);
        toast({
          title: 'Event Scheduled!',
          description: `${destination.name} has been added to your Calendly for ${format(scheduledDate, "MMMM d, yyyy 'at' h:mm a")}.`,
        });
        onEventScheduled();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        variant: "destructive",
        title: "Scheduling Failed",
        description: errorMessage,
      });
    } finally {
        setIsScheduling(false);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <div className="relative w-full h-1/2 flex-shrink-0">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapSrc}>
        </iframe>
      </div>
      <CardContent className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto">
        <h2 className="text-2xl font-headline font-bold">{destination.name}</h2>
        <div className="flex flex-wrap gap-2">
            <WeatherWidget weather={destination.weather} />
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary w-fit">
                <TrafficCone className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground capitalize">{destination.traffic || 'Unknown'}</span>
            </div>
             <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary w-fit">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground capitalize">{destination.busyness || 'Unknown'}</span>
            </div>
        </div>
        <p className="text-sm text-foreground flex-grow">{destination.description}</p>
        <Button className="w-full mt-auto font-headline" onClick={handleSchedule} disabled={isScheduling}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            {isScheduling ? 'Scheduling...' : 'Schedule to Calendar'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DestinationPanel;
