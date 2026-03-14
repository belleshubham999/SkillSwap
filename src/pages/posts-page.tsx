import { Card } from '@/components/ui/card';

export default function PostsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Developer Posts</h1>
      <Card>
        <p className="text-sm">Share build logs, lessons, and launch retrospectives to build reputation and audience.</p>
      </Card>
    </div>
  );
}
