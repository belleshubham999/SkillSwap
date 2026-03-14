import { Card } from '@/components/ui/card';
export default function DashboardPage() {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{['Recommended Projects','Applications','Bookmarks','Matches'].map((k)=><Card key={k}><h3 className="font-semibold">{k}</h3><p className="text-sm text-slate-500">Live data via Supabase queries and realtime subscriptions.</p></Card>)}</div>;
}
