import type { Milestone } from '@/types/domain';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const columns: Milestone['status'][] = ['todo', 'in_progress', 'done'];

export function KanbanBoard({ milestones, onMove }: { milestones: Milestone[]; onMove: (id: string, status: Milestone['status']) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {columns.map((status) => (
        <Card key={status}>
          <h3 className="mb-2 text-sm font-semibold uppercase">{status.replace('_', ' ')}</h3>
          <div className="space-y-2">
            {milestones
              .filter((m) => m.status === status)
              .map((m) => (
                <div key={m.id} className="rounded border border-border p-2 text-sm">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-slate-500">Due {new Date(m.due_date).toLocaleDateString()}</p>
                  <div className="mt-2 flex gap-1">
                    {columns
                      .filter((s) => s !== status)
                      .map((next) => (
                        <Button key={next} className="bg-slate-700 px-2 py-1 text-xs" onClick={() => onMove(m.id, next)}>
                          {next}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
