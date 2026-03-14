import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { supabase } from '@/services/supabase';

export default function AdminPage() {
  const { data } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const [users, projects, reviews, logs, conversions] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('flagged', true),
        supabase.from('activity_logs').select('id', { count: 'exact', head: true }),
        supabase.from('referrals').select('id', { count: 'exact', head: true }).eq('converted', true)
      ]);
      return {
        users: users.count ?? 0,
        projects: projects.count ?? 0,
        flaggedReviews: reviews.count ?? 0,
        events: logs.count ?? 0,
        referralConversions: conversions.count ?? 0
      };
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="font-semibold">Moderation</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Users: {data?.users ?? 0} · Projects: {data?.projects ?? 0} · Flagged reviews: {data?.flaggedReviews ?? 0}
        </p>
      </Card>
      <Card>
        <h2 className="font-semibold">Platform Metrics</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Activity events: {data?.events ?? 0} · Referral conversions: {data?.referralConversions ?? 0}
        </p>
      </Card>
    </div>
  );
}
