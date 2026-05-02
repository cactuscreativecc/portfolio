import { createClient } from '@supabase/supabase-js'

// Função auxiliar ultra-segura para o build
const getSafeEnvVal = (key: string, fallback: string) => {
  if (typeof process === 'undefined' || !process.env) return fallback;
  const val = process.env[key];
  if (!val || val.trim() === "" || val === "undefined" || val === "null") return fallback;
  return val.trim();
};

// Proxy para o cliente padrão para evitar chamadas ao createClient no nível do módulo
// Isso garante que NENHUM código de conexão seja executado durante o build do Vercel
const createLazyClient = () => {
  const url = getSafeEnvVal('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co');
  const key = getSafeEnvVal('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder');
  return createClient(url, key);
};

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (!target.__instance) {
      target.__instance = createLazyClient();
    }
    return target.__instance[prop];
  }
});

// Função para o cliente padrão (seguro para servidor e cliente)
export const getSupabaseClient = () => {
  return createLazyClient();
}

// Função para o cliente Admin (apenas servidor)
export const getSupabaseAdmin = () => {
  const url = getSafeEnvVal('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co');
  const serviceKey = getSafeEnvVal('SUPABASE_SERVICE_ROLE_KEY', 'placeholder');

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
