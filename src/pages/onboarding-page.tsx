import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';

const schema = z.object({ role: z.enum(['developer','founder']), full_name: z.string().min(2), skills: z.string().optional(), company: z.string().optional(), linkedin: z.string().url().optional().or(z.literal('')) });

export default function OnboardingPage() {
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit = async (values: z.infer<typeof schema>) => {
    await supabase.from('profiles').upsert({ full_name: values.full_name, role: values.role });
    if (values.role === 'developer') await supabase.from('developer_profiles').upsert({ skills: values.skills?.split(',').map((s)=>s.trim()) ?? [], goals: ['learning'] });
    if (values.role === 'founder') await supabase.from('founder_profiles').upsert({ company: values.company, linkedin: values.linkedin });
  };
  return <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-xl gap-3"><h1 className="text-2xl font-semibold">Onboarding</h1><input className="rounded border p-2" placeholder="Full name" {...register('full_name')} /><select className="rounded border p-2" {...register('role')}><option value="developer">Developer</option><option value="founder">Founder</option></select><input className="rounded border p-2" placeholder="Skills (comma separated)" {...register('skills')} /><input className="rounded border p-2" placeholder="Company" {...register('company')} /><input className="rounded border p-2" placeholder="LinkedIn URL" {...register('linkedin')} /><Button type="submit">Save profile</Button></form>;
}
