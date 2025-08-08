import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WeatherWidget from '@/components/common/weather-widget';
import type { Destination } from '@/app/wander-wise-client';

interface DestinationPanelProps {
  destination: Destination;
}

const DestinationPanel = ({ destination }: DestinationPanelProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";
  
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(destination.name)}`;

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <div className="relative w-full h-96 flex-shrink-0">
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
        <WeatherWidget weather={destination.weather} />
        <p className="text-sm text-foreground flex-grow">{destination.description}</p>
        <Button className="w-full mt-auto font-headline">Go</Button>
      </CardContent>
    </Card>
  );
};

export default DestinationPanel;
