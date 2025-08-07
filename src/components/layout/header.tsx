import { UserCircle2 } from 'lucide-react';
import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b flex-shrink-0">
      <h1 className="text-2xl font-headline font-bold text-primary">WanderWise</h1>
      <button aria-label="User Profile">
        <UserCircle2 className="w-8 h-8 text-primary" />
      </button>
    </header>
  );
};

export default Header;
