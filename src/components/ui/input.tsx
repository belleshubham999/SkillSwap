import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 dark:placeholder:text-slate-500',
        className
      )}
      {...props}
    />
  );
}
