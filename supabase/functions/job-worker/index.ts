import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { jobs } = await req.json();

  for (const job of jobs ?? []) {
    if (job.name === 'send-notification') {
      await supabase.from('notifications').insert({
        user_id: job.payload.userId,
        type: job.payload.type,
        payload: job.payload.data
      });
    }

    if (job.name === 'recompute-trust-score') {
      const { data } = await supabase.rpc('calculate_founder_trust', { p_founder_id: job.payload.founderId });
      await supabase.from('founder_profiles').update({ trust_score: data }).eq('user_id', job.payload.founderId);
      await supabase.from('projects').update({ trust_score: data }).eq('founder_id', job.payload.founderId);
    }

    if (job.name === 'recompute-recommendations') {
      await supabase.from('usage_events').insert({
        user_id: job.payload.developerId,
        event_name: 'recommendations_recomputed',
        event_group: 'engagement',
        metadata: {}
      });
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
