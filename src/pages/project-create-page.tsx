import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProject } from '@/services/api';
import { Button } from '@/components/ui/button';

const schema = z.object({ title: z.string().min(4), description: z.string().min(30), problem: z.string().min(10), target_users: z.string().min(3), skills_required: z.string().min(2), tech_stack: z.string().min(2), timeline: z.string(), compensation: z.string(), equity_percent: z.coerce.number().min(0).max(100), validation_proof: z.string().optional() });

export default function ProjectCreatePage() {
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit = async (v: z.infer<typeof schema>) => createProject({ ...v, founder_id: 'me', status: 'draft', skills_required: v.skills_required.split(',').map((x)=>x.trim()), tech_stack: v.tech_stack.split(',').map((x)=>x.trim()) });
  return <form className="grid gap-2" onSubmit={handleSubmit(onSubmit)}>{Object.keys(schema.shape).map((k)=><input key={k} className="rounded border p-2" placeholder={k} {...register(k as any)} />)}<Button type="submit">Save Draft</Button></form>;
}
