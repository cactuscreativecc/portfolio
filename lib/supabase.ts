import { createClient } from '@supabase/supabase-js'

// Função auxiliar para obter variáveis com fallback seguro para o build
const getEnvVars = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
});

// Singleton para o cliente padrão
let supabaseInstance: any = null;
export const supabase = (() => {
  if (typeof window === 'undefined') return null as any; // No servidor, não usar o singleton direto no topo
  const { url, anonKey } = getEnvVars();
  return createClient(url, anonKey);
})();

// Função para o cliente padrão (seguro para servidor e cliente)
export const getSupabaseClient = () => {
  const { url, anonKey } = getEnvVars();
  return createClient(url, anonKey);
}

// Função para o cliente Admin (apenas servidor)
export const getSupabaseAdmin = () => {
  const { url, serviceKey } = getEnvVars();

  // Se estivermos no build e as chaves reais faltarem, retornamos um cliente com placeholder
  // para não quebrar a avaliação do módulo, mas as chamadas reais falharão (o que é OK no build)
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
