import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/services/supabase';

const schema = z.object({
  role: z.enum(['developer', 'founder']),
  full_name: z.string().min(2),
  skills: z.string().optional(),
  company: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal(''))
});

export default function OnboardingPage() {
  const { register, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'developer' }
  });

  const role = watch('role');

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    await supabase.from('profiles').upsert({ id: user?.id, full_name: values.full_name, role: values.role });

    if (values.role === 'developer') {
      await supabase.from('developer_profiles').upsert({
        user_id: user?.id,
        skills: values.skills?.split(',').map((s) => s.trim()) ?? [],
        goals: ['learning', 'portfolio']
      });
    }

    if (values.role === 'founder') {
      await supabase
        .from('founder_profiles')
        .upsert({ user_id: user?.id, company: values.company, linkedin: values.linkedin });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-xl gap-3 rounded-xl border border-border bg-card p-6">
      <h1 className="text-2xl font-semibold">Onboarding</h1>
      <label className="text-sm font-medium" htmlFor="full_name">
        Full name
      </label>
      <Input id="full_name" {...register('full_name')} />

      <label className="text-sm font-medium" htmlFor="role">
        Role
      </label>
      <select id="role" className="rounded border border-border bg-card p-2" {...register('role')}>
        <option value="developer">Developer</option>
        <option value="founder">Founder</option>
      </select>

      {role === 'developer' && (
        <>
          <label className="text-sm font-medium" htmlFor="skills">
            Skills
          </label>
          <Input id="skills" placeholder="React, Node.js, PostgreSQL" {...register('skills')} />
        </>
      )}

      {role === 'founder' && (
        <>
          <label className="text-sm font-medium" htmlFor="company">
            Company
          </label>
          <Input id="company" {...register('company')} />
        </>
      )}

      <label className="text-sm font-medium" htmlFor="linkedin">
        LinkedIn URL
      </label>
      <Input id="linkedin" {...register('linkedin')} />

      <Button type="submit">Save profile</Button>
    </form>
  );
}
