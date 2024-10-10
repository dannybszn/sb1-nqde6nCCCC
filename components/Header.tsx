'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/account/login');
  };

  return (
    <header className="bg-background shadow-sm">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/account/discover" className="text-xl font-bold text-primary">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
          </Link>
          <div className="hidden md:flex items-center justify-center space-x-4 flex-grow">
            <Link href="/account/discover" className="text-foreground hover:text-primary">Discover</Link>
            <Link href="/account/messages" className="text-foreground hover:text-primary">Messages</Link>
            <Link href="/account/refer" className="text-foreground hover:text-primary">Refer</Link>
            <Link href="/account/settings" className="text-foreground hover:text-primary">Settings</Link>
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href="/account/discover" className="block text-foreground hover:text-primary">Discover</Link>
            <Link href="/account/messages" className="block text-foreground hover:text-primary">Messages</Link>
            <Link href="/account/refer" className="block text-foreground hover:text-primary">Refer</Link>
            <Link href="/account/settings" className="block text-foreground hover:text-primary">Settings</Link>
          </div>
        )}
      </nav>
    </header>
  );
}