import { createClient } from '@supabase/supabase-js'

// Função auxiliar para garantir que strings não sejam vazias ou inválidas durante o build
const getSafeEnv = (val: string | undefined, fallback: string) => {
  if (!val || val.trim() === "" || val === "undefined") return fallback;
  return val;
};

const supabaseUrl = getSafeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://placeholder.supabase.co');
const supabaseAnonKey = getSafeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'placeholder');

// Cliente para uso geral (Browser e Servidor)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para o cliente Admin (apenas servidor)
export const getSupabaseAdmin = () => {
  const url = getSafeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://placeholder.supabase.co');
  const serviceKey = getSafeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY, 'placeholder');

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
