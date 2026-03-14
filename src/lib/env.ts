import { z } from 'zod';

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(20)
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = {
  supabaseUrl: parsed.data.VITE_SUPABASE_URL,
  supabaseAnonKey: parsed.data.VITE_SUPABASE_ANON_KEY
};
