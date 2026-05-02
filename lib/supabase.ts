import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ========================================================================
// IMPORTANTE: Next.js só substitui process.env.NEXT_PUBLIC_* no client-side
// quando a referência é LITERAL (ex: process.env.NEXT_PUBLIC_SUPABASE_URL).
// Funções dinâmicas como getEnvVar('NEXT_PUBLIC_SUPABASE_URL') NÃO funcionam
// no browser porque o bundler não consegue fazer a substituição em build-time.
// ========================================================================

// Referências estáticas — funciona tanto no server quanto no client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Cache para evitar criar múltiplas instâncias
let _supabaseClient: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

/**
 * Cliente padrão (anon key) — funciona no browser e no servidor.
 * Usa persistSession para manter login entre páginas.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_supabaseClient) return _supabaseClient

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  _supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return _supabaseClient
}

/**
 * Cliente admin (service role key) — APENAS para uso em API routes no servidor.
 * Nunca importe isso em componentes client-side.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin

  // Service role key não é NEXT_PUBLIC_, então só existe no servidor
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  if (!SUPABASE_URL || !serviceKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (server-only)'
    )
  }

  _supabaseAdmin = createClient(SUPABASE_URL, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return _supabaseAdmin
}

/**
 * Export de compatibilidade — Proxy lazy que cria o client sob demanda.
 * Funciona em "use client" components sem quebrar o build do Vercel.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseClient()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
