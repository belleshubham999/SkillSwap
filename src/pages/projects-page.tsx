import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/states/skeleton';

export default function ProjectsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['projects'], queryFn: () => getProjects() });
  if (isLoading) return <div className="space-y-2">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-24"/> )}</div>;
  return <div className="grid gap-4">{data?.map((p: any)=><Card key={p.id}><div className="flex items-center justify-between"><h2 className="font-semibold">{p.title}</h2><span>{Math.round(p.match_score ?? 0)}% match</span></div><p className="text-sm text-slate-500">{p.description}</p></Card>)}</div>;
}
