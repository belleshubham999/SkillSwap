import { Github } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';

export default function AuthPage() {
  const location = useLocation();
  const redirectPath = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const signIn = (provider: 'google' | 'github') =>
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${redirectPath}` }
    });

  return (
    <div className="mx-auto mt-24 max-w-md space-y-3 rounded-xl border border-border bg-card p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-slate-500 dark:text-slate-300">Continue with your preferred account.</p>
      <Button className="w-full" onClick={() => signIn('google')}>
        Continue with Google
      </Button>
      <Button className="w-full bg-slate-900" onClick={() => signIn('github')}>
        <Github className="mr-2 inline size-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}
