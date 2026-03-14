import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProject } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/services/supabase';

const schema = z.object({
  title: z.string().min(4),
  description: z.string().min(30),
  problem: z.string().min(10),
  target_users: z.string().min(3),
  skills_required: z.string().min(2),
  tech_stack: z.string().min(2),
  timeline: z.string(),
  compensation: z.string(),
  equity_percent: z.coerce.number().min(0).max(100),
  validation_proof: z.string().optional(),
  status: z.enum(['draft', 'published']),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced'])
});

export default function ProjectCreatePage() {
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft', difficulty_level: 'intermediate' }
  });

  const onSubmit = async (v: z.infer<typeof schema>) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    await createProject({
      ...v,
      founder_id: user?.id ?? '',
      attachments: [],
      skills_required: v.skills_required.split(',').map((x) => x.trim()),
      tech_stack: v.tech_stack.split(',').map((x) => x.trim())
    });
  };

  return (
    <form className="grid gap-2 rounded-xl border border-border bg-card p-5" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">Create Project</h1>
      <Input placeholder="Title" {...register('title')} />
      <Input placeholder="Description" {...register('description')} />
      <Input placeholder="Problem" {...register('problem')} />
      <Input placeholder="Target users" {...register('target_users')} />
      <Input placeholder="Skills required (comma separated)" {...register('skills_required')} />
      <Input placeholder="Tech stack (comma separated)" {...register('tech_stack')} />
      <Input placeholder="Timeline" {...register('timeline')} />
      <Input placeholder="Compensation" {...register('compensation')} />
      <Input placeholder="Equity %" type="number" {...register('equity_percent')} />
      <Input placeholder="Validation proof URL" {...register('validation_proof')} />
      <select className="rounded border border-border bg-card p-2" {...register('difficulty_level')}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select className="rounded border border-border bg-card p-2" {...register('status')}>
        <option value="draft">Save Draft</option>
        <option value="published">Publish</option>
      </select>
      <Button type="submit">Submit</Button>
    </form>
  );
}
