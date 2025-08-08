import { UserCircle2 } from 'lucide-react';
import type { FC } from 'react';
import ThemeSwitcher from '../common/theme-switcher';

const Header: FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card rounded-t-lg">
      <h1 className="text-2xl font-headline font-bold text-primary">Talk2GO</h1>
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
