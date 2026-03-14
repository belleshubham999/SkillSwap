import { useQuery } from '@tanstack/react-query';
import { listCommunityPosts, upvotePost } from '@/services/api';
import { PostCard } from '@/components/community/post-card';

export default function CommunityPage() {
  const { data, refetch } = useQuery({ queryKey: ['community-posts'], queryFn: listCommunityPosts });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Community</h1>
      <p className="text-sm text-slate-500 dark:text-slate-300">Developer posts, founder AMAs, and project discussions.</p>
      <div className="grid gap-3">
        {(data ?? []).map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpvote={async (id) => {
              await upvotePost(id);
              await refetch();
            }}
          />
        ))}
      </div>
    </div>
  );
}
