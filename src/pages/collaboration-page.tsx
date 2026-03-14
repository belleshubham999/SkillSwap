import { useQuery } from '@tanstack/react-query';
import { getMilestones, updateMilestone } from '@/services/api';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { Card } from '@/components/ui/card';

export default function CollaborationPage() {
  const matchId = 'active-match';
  const { data = [], refetch } = useQuery({ queryKey: ['milestones', matchId], queryFn: () => getMilestones(matchId) });

  const progress = data.length ? Math.round((data.filter((m) => m.status === 'done').length / data.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Collaboration Space</h1>
      <Card>
        <p className="text-sm">Milestone completion: {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </Card>
      <KanbanBoard
        milestones={data}
        onMove={async (id, status) => {
          await updateMilestone(id, status);
          await refetch();
        }}
      />
    </div>
  );
}
