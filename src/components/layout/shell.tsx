import type { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CommandPalette } from '@/components/command/command-palette';
import { useCommandPalette } from '@/hooks/useCommandPalette';

const navItems = [
  { to: '/projects', label: 'Projects' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/community', label: 'Community' },
  { to: '/messages', label: 'Messages' },
  { to: '/admin', label: 'Admin' }
];

export function Shell({ children }: PropsWithChildren) {
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  const { open, setOpen } = useCommandPalette();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 p-4" aria-label="Primary">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            SkillSwap
          </Link>
          <div className="hidden items-center gap-1 text-sm lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 transition ${isActive ? 'bg-muted font-medium' : 'hover:bg-muted'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" className="bg-slate-700 px-2" aria-label="Open command palette" onClick={() => setOpen(true)}>
              <Search className="size-4" />
            </Button>
            <Button
              type="button"
              className="bg-slate-700 px-2"
              aria-label="Toggle color mode"
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">{children}</main>
      <CommandPalette open={open} setOpen={setOpen} />
    </div>
  );
}
