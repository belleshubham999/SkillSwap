import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';

export default function AuthPage() {
  const signIn = (provider: 'google' | 'github') => supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/dashboard` } });
  return <div className="mx-auto mt-24 max-w-md space-y-3"><h1 className="text-2xl font-semibold">Sign in</h1><Button onClick={() => signIn('google')}>Continue with Google</Button><Button className="w-full bg-slate-900" onClick={() => signIn('github')}><Github className="mr-2 inline size-4"/>Continue with GitHub</Button></div>;
}
