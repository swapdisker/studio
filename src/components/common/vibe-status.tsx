'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from "@/hooks/use-toast";
import { interpretVibeStatus } from '@/ai/flows/interpret-vibe-status';
import { Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const vibes = ['Energetic', 'Relaxed', 'Adventurous', 'Creative', 'Social', 'Cozy'];

const VibeStatus = () => {
  const [currentVibe, setCurrentVibe] = useState('Relaxed');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectVibe = async (vibe: string) => {
    setCurrentVibe(vibe);
    setOpen(false);
    
    toast({
        title: `Vibe set to: ${vibe}`,
        description: `Finding recommendations for a ${vibe.toLowerCase()} mood...`,
    });

    try {
      const result = await interpretVibeStatus({ vibeStatus: vibe });
      toast({
        title: `Vibe: ${vibe}`,
        description: `${result.recommendation}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get a recommendation for this vibe.",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal text-base py-6">
          <Sparkles className="mr-2 h-4 w-4" />
          Vibe Status: {currentVibe}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[336px] p-0">
        <div className="p-2">
            <h4 className="font-medium font-headline leading-none px-2 py-1.5 text-sm text-muted-foreground">How are you feeling?</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {vibes.map((vibe) => (
                    <Button 
                        key={vibe} 
                        variant="ghost" 
                        className={cn("flex-1 justify-start", currentVibe === vibe && "bg-accent text-accent-foreground")}
                        onClick={() => handleSelectVibe(vibe)}
                    >
                       {currentVibe === vibe && <Check className="mr-2 h-4 w-4" />}
                       {vibe}
                    </Button>
                ))}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VibeStatus;
