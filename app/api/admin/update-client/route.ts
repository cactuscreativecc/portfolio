import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
    try {
        const { clientId, fullName, email, phone, password, adminToken } = await req.json();

        // 1. Verify admin token
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(adminToken);
        if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check if role is admin
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Nível de acesso insuficiente.' }, { status: 403 });
        }

        // 2. Update auth.users (email and password)
        const updateData: any = {
            email: email,
            user_metadata: { full_name: fullName }
        };
        if (password && password.trim() !== '') {
            updateData.password = password;
        }

        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(clientId, updateData);
        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // 3. Update public.profiles
        const updateProfileData: any = { full_name: fullName, phone: phone };
        if (password && password.trim() !== '') {
            updateProfileData.plain_password = password;
        }

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update(updateProfileData)
            .eq('id', clientId);

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update client error:', error);
        return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
    }
}
