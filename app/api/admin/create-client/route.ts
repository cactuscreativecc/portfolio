import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
    try {
        const {
            email,
            password,
            fullName,
            phone,
            emergencyContact,
            address,
            companyName,
            adminToken
        } = await req.json();

        // 1. Verify admin token
        const { data: { user: adminUser }, error: userError } = await supabaseAdmin.auth.getUser(adminToken);
        if (userError || !adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: adminProfile } = await supabaseAdmin.from('profiles').select('role').eq('id', adminUser.id).single();
        if (adminProfile?.role !== 'admin') {
            return NextResponse.json({ error: 'Nível de acesso insuficiente.' }, { status: 403 });
        }

        // 2. Create user in auth.users
        const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName, company_name: companyName }
        });

        if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

        // 3. Create entry in public.profiles
        // We use upsert in case a trigger already created a partial profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: newUser.user.id,
                full_name: fullName,
                email: email,
                phone: phone,
                role: 'client',
                emergency_contact: emergencyContact,
                company_name: companyName,
                address: address,
                plain_password: password // Store for admin visibility
            });

        if (profileError) {
            // Clean up auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
            return NextResponse.json({ error: profileError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, user: newUser.user });
    } catch (error: any) {
        console.error('Create client error:', error);
        return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
    }
}
