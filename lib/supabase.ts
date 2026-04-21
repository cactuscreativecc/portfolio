import { createClient } from '@supabase/supabase-js'

// Fallbacks para evitar erro durante o build na Vercel caso variáveis de ambiente não estejam configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Cliente para uso no lado do cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para criar cliente com Service Role Key (apenas para uso no servidor)
export const getSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // No servidor, precisamos garantir que as variáveis reais existam para operações críticas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceRoleKey) {
    console.error('Configurações do administrador do Supabase faltando!')
    // Retornamos o cliente padrão para evitar crash de build, 
    // mas as operações reais vão falhar com erro de autenticação se chamadas sem as chaves
    return supabase;
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
