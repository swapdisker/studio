import { UserCircle2, MapPin } from 'lucide-react';
import type { FC } from 'react';
import ThemeSwitcher from '../common/theme-switcher';
import type { Location } from '@/app/wander-wise-client';

interface HeaderProps {
    location: Location | null;
}

const Header: FC<HeaderProps> = ({ location }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card flex-shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-headline font-bold text-primary">Talk2GO</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            {location ? (
                <div className="flex items-baseline gap-2">
                    <span>
                        {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
                    </span>
                    {location.city && (
                        <span className="text-xs text-muted-foreground/80">{location.city}</span>
                    )}
                </div>
            ) : (
                <span>Getting location...</span>
            )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <button aria-label="User Profile">
          <UserCircle2 className="w-8 h-8 text-primary" />
        </button>
      </div>
    </header>
  );
};

export default Header;
