import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/states/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['projects', search],
      queryFn: ({ pageParam }) => getProjects({ page: pageParam, pageSize: 12, search, sort: 'match' }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage
    });

  const projects = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          aria-label="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, skills, stack"
        />
        <Button className="bg-slate-700" onClick={() => refetch()}>
          Search
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {isError && <Card className="text-sm text-red-500">Unable to load projects. Please retry.</Card>}

      {!isLoading && !isError && projects.length === 0 && (
        <Card className="text-sm text-slate-500">No projects yet. Try another search.</Card>
      )}

      <div className="grid gap-4">
        {projects.map((p) => (
          <Card key={p.id} className="transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <h2 className="text-base font-semibold">{p.title}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{Math.round(p.match_score ?? 0)}% match</span>
                <span className="rounded-md bg-muted px-2 py-1 text-xs">Trust {Math.round(p.trust_score ?? 0)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tech_stack.slice(0, 5).map((stack) => (
                <span key={stack} className="rounded bg-muted px-2 py-1 text-xs">
                  {stack}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <Button className="bg-slate-700" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  );
}
