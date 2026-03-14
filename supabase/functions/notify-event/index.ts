import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { user_id, type, payload } = await req.json();
  const { error } = await supabase.from('notifications').insert({ user_id, type, payload });
  if (error) return new Response(error.message, { status: 500 });
  await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
    method: 'POST',
    headers: { Authorization: req.headers.get('Authorization')!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: payload.email, subject: `SkillSwap: ${type}`, html: `<p>${type}</p>` })
  });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
});
