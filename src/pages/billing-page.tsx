import { Card } from '@/components/ui/card';

export default function BillingPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Billing & Plans</h1>
      <Card><p className="text-sm">Starter, Growth, and Pro tiers with feature gating scaffolding and usage tracking.</p></Card>
    </div>
  );
}
