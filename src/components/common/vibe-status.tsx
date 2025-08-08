'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from "@/hooks/use-toast";
import { interpretVibeStatus } from '@/ai/flows/interpret-vibe-status';
import { Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const vibes = [
    { name: 'Energetic', color: 'bg-[hsl(var(--chart-1))]', textColor: 'text-white', glow: 'shadow-[0_0_15px_hsl(var(--chart-1))]' },
    { name: 'Relaxed', color: 'bg-[hsl(var(--chart-2))]', textColor: 'text-white', glow: 'shadow-[0_0_15px_hsl(var(--chart-2))]' },
    { name: 'Adventurous', color: 'bg-[hsl(var(--chart-5))]', textColor: 'text-white', glow: 'shadow-[0_0_15px_hsl(var(--chart-5))]' },
    { name: 'Creative', color: 'bg-[hsl(var(--chart-4))]', textColor: 'text-black', glow: 'shadow-[0_0_15px_hsl(var(--chart-4))]' },
    { name: 'Social', color: 'bg-[hsl(var(--primary))]', textColor: 'text-white', glow: 'shadow-[0_0_15px_hsl(var(--primary))]' },
    { name: 'Cozy', color: 'bg-[hsl(var(--secondary))]', textColor: 'text-black', glow: 'shadow-[0_0_15px_hsl(var(--secondary))]' },
];

interface VibeStatusProps {
    currentVibe: string;
    onVibeChange: (vibe: string) => void;
}

const VibeStatus = ({ currentVibe, onVibeChange }: VibeStatusProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectVibe = async (vibe: string) => {
    onVibeChange(vibe);
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
  
  const selectedVibe = vibes.find(v => v.name === currentVibe);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
            variant="outline" 
            className={cn(
                "w-full justify-start font-normal text-base py-6 transition-all duration-300",
                selectedVibe ? `${selectedVibe.color} ${selectedVibe.textColor} hover:${selectedVibe.color}/90 focus:${selectedVibe.color} ${selectedVibe.glow}` : ""
            )}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Vibe Status: {currentVibe}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[336px] p-0">
        <div className="p-2">
            <h4 className="font-medium font-headline leading-none px-2 py-1.5 text-sm text-muted-foreground">How are you feeling?</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {vibes.map((vibe) => (
                    <Button 
                        key={vibe.name} 
                        variant="ghost" 
                        className={cn(
                            "flex-1 justify-start", 
                            currentVibe === vibe.name && `${vibe.color} ${vibe.textColor} hover:${vibe.color}/90`,
                        )}
                        onClick={() => handleSelectVibe(vibe.name)}
                    >
                       {currentVibe === vibe.name && <Check className="mr-2 h-4 w-4" />}
                       {vibe.name}
                    </Button>
                ))}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VibeStatus;
