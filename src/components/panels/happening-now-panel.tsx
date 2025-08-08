'use client'
import { ChevronsRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import VibeStatus from '@/components/common/vibe-status';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CalendarEventsPopover from '@/components/common/calendar-events-popover';
import { getCalendlyEvents, CalendlyEvent } from '@/ai/tools/calendly';

interface HappeningNowPanelProps {
  onSelectDestination: (id: number) => void;
  currentVibe: string;
  onVibeChange: (vibe: string) => void;
}

const HappeningNowPanel = ({ onSelectDestination, currentVibe, onVibeChange }: HappeningNowPanelProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<Record<string, CalendlyEvent[]>>({});

    useEffect(() => {
        async function fetchEvents() {
            try {
                const calendlyEvents = await getCalendlyEvents();
                const eventsByDate: Record<string, CalendlyEvent[]> = {};
                calendlyEvents.forEach(event => {
                    const dateStr = new Date(event.start_time).toISOString().split('T')[0];
                    if (!eventsByDate[dateStr]) {
                        eventsByDate[dateStr] = [];
                    }
                    eventsByDate[dateStr].push(event);
                });
                setEvents(eventsByDate);
            } catch (error) {
                console.error("Failed to fetch Calendly events", error);
            }
        }
        fetchEvents();
    }, []);

    const getEventCountForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return events[dateString]?.length || 0;
    }

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

    const popoverEvents = selectedDay ? events[selectedDay.toISOString().split('T')[0]] || [] : [];
    const formattedEvents = popoverEvents.map(e => ({
        time: new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: e.name
    }));

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
                    <CalendarEventsPopover date={selectedDay} events={formattedEvents} />
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
            <VibeStatus currentVibe={currentVibe} onVibeChange={onVibeChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HappeningNowPanel;
