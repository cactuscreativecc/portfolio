import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cache para instâncias
let _supabaseClient: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

// Fallbacks seguros para o build
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder';

/**
 * Cliente padrão (anon key) — seguro para uso em API routes e componentes server-side.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_supabaseClient) return _supabaseClient

  // IMPORTANTE: O Next.js exige acesso estático para injetar variáveis no cliente
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

  _supabaseClient = createClient(url, anonKey)
  return _supabaseClient
}

/**
 * Cliente admin (service role key) — APENAS para uso no servidor.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_KEY;

  _supabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return _supabaseAdmin
}

/**
 * Proxy transparente para compatibilidade com o código existente.
 * O Proxy evita a chamada ao createClient durante a avaliação do módulo no build.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
