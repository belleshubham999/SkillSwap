import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPortfolio } from '@/services/api';
import { Card } from '@/components/ui/card';

export default function PortfolioPage() {
  const { username = '' } = useParams();
  const { data } = useQuery({ queryKey: ['portfolio', username], queryFn: () => getPortfolio(username) });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{username}&apos;s Portfolio</h1>
      <Card>
        <pre className="overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
      </Card>
    </div>
  );
}
