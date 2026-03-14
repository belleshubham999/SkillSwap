import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { getTopMatches } from '@/services/api';
import { supabase } from '@/services/supabase';

export default function DashboardPage() {
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const [projects, applications, bookmarks, matches, referrals] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
        supabase.from('bookmarks').select('id', { count: 'exact', head: true }),
        supabase.from('matches').select('id', { count: 'exact', head: true }),
        supabase.from('referrals').select('id', { count: 'exact', head: true })
      ]);

      return {
        projects: projects.count ?? 0,
        applications: applications.count ?? 0,
        bookmarks: bookmarks.count ?? 0,
        matches: matches.count ?? 0,
        referrals: referrals.count ?? 0
      };
    }
  });

  const { data: topMatches } = useQuery({ queryKey: ['top-matches'], queryFn: getTopMatches });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Recommended Projects', metrics?.projects ?? 0],
          ['Applications', metrics?.applications ?? 0],
          ['Bookmarks', metrics?.bookmarks ?? 0],
          ['Matches', metrics?.matches ?? 0],
          ['Referrals', metrics?.referrals ?? 0]
        ].map(([k, v]) => (
          <Card key={k as string} className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-300">{k}</h3>
            <p className="text-3xl font-bold tracking-tight">{v}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Top matches for you</h2>
        <div className="space-y-2">
          {(topMatches ?? []).map((match) => (
            <div key={match.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <div>
                <p className="text-sm font-medium">{match.title}</p>
                <p className="text-xs text-slate-500">Potential equity: {match.equity_percent}%</p>
              </div>
              <span className="rounded bg-muted px-2 py-1 text-xs font-medium">{Math.round(match.match_score)}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
