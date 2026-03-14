import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const commands = [
  { label: 'Go to Projects', path: '/projects' },
  { label: 'Go to Dashboard', path: '/dashboard' },
  { label: 'Go to Community', path: '/community' },
  { label: 'Create Project', path: '/projects/new' },
  { label: 'Open Messages', path: '/messages' },
  { label: 'Open Collaboration Space', path: '/collaboration' },
  { label: 'Open Analytics', path: '/analytics' }
];

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4" onClick={() => setOpen(false)}>
      <div
        className="mx-auto mt-16 max-w-xl rounded-2xl border border-border bg-card p-4 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          autoFocus
          placeholder="Search projects, users, pages, commands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="mt-3 max-h-80 space-y-1 overflow-auto">
          {filtered.map((item) => (
            <li key={item.path}>
              <button
                className="w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted"
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                  setQuery('');
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
