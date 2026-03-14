import { vi, expect } from 'vitest';
import { getProjects } from '@/services/api';

const queryBuilder: any = {
  eq: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  textSearch: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data: [], count: 0, error: null })
};

vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => queryBuilder)
    }))
  }
}));

test('returns paginated project payload', async () => {
  const result = await getProjects({ page: 0, pageSize: 10, sort: 'match' });
  expect(result.items).toEqual([]);
  expect(result.nextPage).toBeUndefined();
});
