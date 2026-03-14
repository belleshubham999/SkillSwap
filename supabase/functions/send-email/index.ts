import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (req) => {
  const { to, subject, html } = await req.json();
  const key = Deno.env.get('SENDGRID_API_KEY');
  const from = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@skillswap.app';
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ personalizations: [{ to: [{ email: to }] }], from: { email: from }, subject, content: [{ type: 'text/html', value: html }] })
  });
  return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 500, headers: { 'Content-Type': 'application/json' } });
});
