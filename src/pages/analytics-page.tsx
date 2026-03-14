import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card><h2 className="font-semibold">Acquisition</h2><p className="text-sm">Track signups by channel and referral.</p></Card>
      <Card><h2 className="font-semibold">Activation</h2><p className="text-sm">Track onboarding completion and first actions.</p></Card>
      <Card><h2 className="font-semibold">Retention</h2><p className="text-sm">Monitor weekly engagement by role.</p></Card>
      <Card><h2 className="font-semibold">Project Success</h2><p className="text-sm">Completion rates, satisfaction, repeat collaborations.</p></Card>
    </div>
  );
}
