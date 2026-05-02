import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cache para evitar criar múltiplas instâncias
let _supabaseClient: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getEnvVar(key: string): string {
  const value = process.env[key]
  if (!value || value.trim() === '' || value === 'undefined' || value === 'null') {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value.trim()
}

/**
 * Cliente padrão (anon key) — seguro para uso em API routes e componentes server-side.
 * NÃO é executado durante o build, apenas quando chamado em runtime.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_supabaseClient) return _supabaseClient

  const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  _supabaseClient = createClient(url, anonKey)
  return _supabaseClient
}

/**
 * Cliente admin (service role key) — APENAS para uso em API routes no servidor.
 * Nunca exponha isso no client-side.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin

  const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY')

  _supabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return _supabaseAdmin
}

/**
 * Alias para compatibilidade — use getSupabaseClient() diretamente quando possível.
 * Evite usar `supabase` como export estático no nível do módulo.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseClient()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
