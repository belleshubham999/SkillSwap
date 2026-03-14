import { Card } from '@/components/ui/card';

export default function DiscussionsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Project Discussions</h1>
      <Card>
        <p className="text-sm">Threaded project discussion boards are enabled via `discussion_threads` + `discussion_comments` tables.</p>
      </Card>
    </div>
  );
}
