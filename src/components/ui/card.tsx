import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm shadow-slate-900/[0.04] backdrop-blur supports-[backdrop-filter]:bg-card/90',
        className
      )}
    >
      {children}
    </div>
  );
}
