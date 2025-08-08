'use client';

import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface CalendarEvent {
  time: string;
  title: string;
}

interface CalendarEventsPopoverProps {
  date?: Date;
  events: CalendarEvent[];
}

const CalendarEventsPopover = ({ date, events }: CalendarEventsPopoverProps) => {
  if (!date) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold font-headline text-lg">
        {format(date, 'MMMM d, yyyy')}
      </h3>
      <Separator />
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="text-sm font-semibold w-20 shrink-0">{event.time}</div>
              <div className="text-sm text-muted-foreground">{event.title}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
      )}
    </div>
  );
};

export default CalendarEventsPopover;
