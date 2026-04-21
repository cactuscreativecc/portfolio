import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createPortalUsers() {
    console.log('Iniciando criação de usuários do portal...')

    const users = [
        {
            email: 'admin@cactuscreative.cc',
            password: 'quakerlz',
            data: { full_name: 'Cactus Admin', role: 'admin' }
        },
        {
            email: 'cliente@gocaseviagens.com.br',
            password: 'quakerlz',
            data: { full_name: 'GoCase Cliente', role: 'client' }
        }
    ]

    for (const userData of users) {
        const { data, error } = await supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: userData.data
        })

        if (error) {
            if (error.message.includes('already registered')) {
                console.log(`Usuário ${userData.email} já existe.`)
            } else {
                console.error(`Erro ao criar ${userData.email}:`, error.message)
            }
        } else {
            console.log(`Usuário ${userData.email} criado com sucesso!`)
        }
    }
}

createPortalUsers()
