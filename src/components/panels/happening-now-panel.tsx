'use client'
import { ChevronsRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import VibeStatus from '@/components/common/vibe-status';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CalendarEventsPopover from '@/components/common/calendar-events-popover';

interface HappeningNowPanelProps {
  onSelectDestination: (id: number) => void;
}

const mockEvents = {
  "2024-07-29": [{ time: "10:00 AM", title: "Team Standup" }, { time: "2:00 PM", title: "Design Review" }],
  "2024-07-30": [],
  "2024-08-01": [{ time: "11:00 AM", title: "Lunch with Sarah" }],
  "2024-08-05": [
    { time: "9:00 AM", title: "Project Kickoff" },
    { time: "1:00 PM", title: "User Interview" },
    { time: "4:00 PM", title: "Sync with Marketing" },
    { time: "6:00 PM", title: "Yoga Class" }
  ],
  "2024-08-15": [{ time: "All Day", title: "Company Offsite" }],
};

const getEventCountForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return mockEvents[dateString]?.length || 0;
}

const HappeningNowPanel = ({ onSelectDestination }: HappeningNowPanelProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

    const handleDayClick = (day: Date) => {
        setSelectedDay(day);
        setPopoverOpen(true);
    };

    const modifiers = {
        busy: (date: Date) => getEventCountForDate(date) > 2,
        some: (date: Date) => getEventCountForDate(date) > 0 && getEventCountForDate(date) <= 2,
        free: (date: Date) => getEventCountForDate(date) === 0,
    };

    const modifiersStyles = {
        busy: { backgroundColor: '#FF6B6B', color: 'white' },
        some: { backgroundColor: '#FFD166' },
        free: { backgroundColor: '#90EE90' },
    };


  return (
    <div className="w-96 flex-shrink-0 flex flex-col gap-4">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Happening Now</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-grow">
          <div className="space-y-3">
            <button onClick={() => onSelectDestination(1)} className="w-full text-left" aria-label="Select Art & Culture event">
              <Card className="bg-[hsl(var(--chart-2))] text-white hover:bg-[hsl(var(--chart-2))]/90 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div>
                    <CardTitle className="text-lg font-headline">Art &amp; Culture</CardTitle>
                    <CardDescription className="text-white/80">Visit the Museum of Modern Art</CardDescription>
                  </div>
                  <ChevronsRight />
                </CardHeader>
              </Card>
            </button>
            <button onClick={() => onSelectDestination(2)} className="w-full text-left" aria-label="Select Outdoor Fun event">
              <Card className="bg-[hsl(var(--chart-1))] text-white hover:bg-[hsl(var(--chart-1))]/90 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div>
                    <CardTitle className="text-lg font-headline">Outdoor Fun</CardTitle>
                    <CardDescription className="text-white/80">Live music at the park</CardDescription>
                  </div>
                  <ChevronsRight />
                </CardHeader>
              </Card>
            </button>
          </div>

          <Separator />

          <div className="flex justify-center">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <div className="w-full">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            onDayClick={handleDayClick}
                            className="rounded-md border w-full"
                            modifiers={modifiers}
                            modifiersStyles={modifiersStyles}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <CalendarEventsPopover date={selectedDay} events={mockEvents[selectedDay?.toISOString().split('T')[0] || ''] || []} />
                </PopoverContent>
            </Popover>
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
