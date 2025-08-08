'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CornerDownLeft, Bot, User, BrainCircuit } from 'lucide-react';
import { generatePersonalizedRecommendations, GeneratePersonalizedRecommendationsOutput } from '@/ai/flows/generate-personalized-recommendations';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import type { Location } from '@/app/wander-wise-client';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const quickPrompts = [
  "Find a quiet coffee shop nearby",
  "Any live music events tonight?",
  "Suggest a good place for a first date",
  "What are some family-friendly activities?",
];

interface ChatPanelProps {
  onNewRecommendation: (recommendation: GeneratePersonalizedRecommendationsOutput['recommendations'][0] | null) => void;
  location: Location | null;
}

const ChatPanel = ({ onNewRecommendation, location }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (prompt?: string) => {
    const userMessage = prompt || input;
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await generatePersonalizedRecommendations({
        query: userMessage,
        latitude: location?.latitude,
        longitude: location?.longitude
      });

      if (result.recommendations && result.recommendations.length > 0) {
        onNewRecommendation(result.recommendations[0]);
        const assistantMessage = `I found a few places for you. I've put the top result, ${result.recommendations[0].name}, on the map. \n\nHere are some other options:\n${result.recommendations.slice(1).map(r => `- ${r.name}`).join('\n')}`;
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);

      } else {
        onNewRecommendation(null);
        setMessages((prev) => [...prev, { role: 'assistant', content: "I couldn't find any recommendations for that. Try something else!" }]);
      }

    } catch (error) {
      console.error(error);
      onNewRecommendation(null);
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'm sorry, I couldn't fetch recommendations right now. Please try again later." }]);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to get recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardContent className="flex-1 flex flex-col p-4 gap-4 h-full">
        <ScrollArea className="flex-1 pr-4" viewportRef={scrollViewportRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <BrainCircuit className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-headline font-semibold">How can I help you today?</h2>
              <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-md">
                {quickPrompts.map((prompt) => (
                  <Button key={prompt} variant="outline" className="h-auto whitespace-normal py-3 justify-center text-center font-body" onClick={() => handleSendMessage(prompt)}>
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn('rounded-lg p-3 max-w-md shadow-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border')}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-card border">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                      </div>
                    </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for recommendations..."
            className="flex-1"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" disabled={isLoading} aria-label="Send message">
            <CornerDownLeft className="w-5 h-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
