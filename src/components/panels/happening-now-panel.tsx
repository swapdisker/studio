'use client'
import { ChevronsRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import VibeStatus from '@/components/common/vibe-status';
import { useState } from 'react';

interface HappeningNowPanelProps {
  onSelectDestination: (id: number) => void;
}

const HappeningNowPanel = ({ onSelectDestination }: HappeningNowPanelProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="w-96 flex-shrink-0 flex flex-col gap-4">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Happening Now</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-grow">
          <div className="space-y-3">
            <button onClick={() => onSelectDestination(1)} className="w-full text-left" aria-label="Select Art & Culture event">
              <Card className="hover:bg-secondary transition-colors">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div>
                    <CardTitle className="text-lg font-headline">Art &amp; Culture</CardTitle>
                    <CardDescription>Visit the Museum of Modern Art</CardDescription>
                  </div>
                  <ChevronsRight className="text-muted-foreground" />
                </CardHeader>
              </Card>
            </button>
            <button onClick={() => onSelectDestination(2)} className="w-full text-left" aria-label="Select Outdoor Fun event">
              <Card className="hover:bg-secondary transition-colors">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div>
                    <CardTitle className="text-lg font-headline">Outdoor Fun</CardTitle>
                    <CardDescription>Live music at the park</CardDescription>
                  </div>
                  <ChevronsRight className="text-muted-foreground" />
                </CardHeader>
              </Card>
            </button>
          </div>

          <Separator />

          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-0 w-full"
            />
          </div>

          <Separator />
          
          <div className="text-center px-2">
            <p className="text-sm text-muted-foreground">
              Good morning! The city is bustling with life. Let&apos;s find your next adventure.
            </p>
          </div>

          <div className="mt-auto pt-2">
            <VibeStatus />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HappeningNowPanel;
