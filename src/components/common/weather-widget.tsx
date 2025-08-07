import { Sun, Cloud, CloudRain } from 'lucide-react';

interface WeatherWidgetProps {
  weather: {
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rainy';
  };
}

const WeatherWidget = ({ weather }: WeatherWidgetProps) => {
  const Icon = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
  }[weather.condition];

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary w-fit">
      <Icon className="w-6 h-6 text-primary" />
      <span className="font-bold text-lg text-secondary-foreground">{weather.temp}°C</span>
      <span className="text-muted-foreground capitalize">{weather.condition}</span>
    </div>
  );
};

export default WeatherWidget;
