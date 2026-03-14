import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export function Shell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">SkillSwap</Link>
          <div className="space-x-3 text-sm">
            <Link to="/projects">Projects</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
