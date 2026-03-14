import type { CommunityPost } from '@/types/domain';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PostCard({ post, onUpvote }: { post: CommunityPost; onUpvote: (id: string) => void }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{post.title}</h3>
        <span className="text-xs uppercase text-slate-500">{post.category}</span>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{post.content}</p>
      <Button className="mt-3 bg-slate-700" onClick={() => onUpvote(post.id)}>
        ▲ {post.upvotes}
      </Button>
    </Card>
  );
}
