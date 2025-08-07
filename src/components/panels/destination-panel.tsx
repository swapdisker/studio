import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WeatherWidget from '@/components/common/weather-widget';
import type { Destination } from '@/app/wander-wise-client';

interface DestinationPanelProps {
  destination: Destination;
}

const DestinationPanel = ({ destination }: DestinationPanelProps) => {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <div className="relative w-full h-48 flex-shrink-0">
        <Image src={destination.image} alt={destination.name} layout="fill" objectFit="cover" data-ai-hint={destination.aiHint} />
      </div>
      <CardContent className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto">
        <h2 className="text-2xl font-headline font-bold">{destination.name}</h2>
        <WeatherWidget weather={destination.weather} />
        <p className="text-sm text-foreground flex-grow">{destination.description}</p>
        <Button className="w-full mt-auto font-headline">Go</Button>
      </CardContent>
    </Card>
  );
};

export default DestinationPanel;
