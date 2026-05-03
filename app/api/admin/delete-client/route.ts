import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    const supabase = getSupabaseAdmin();
    try {
        const { clientId, adminToken } = await req.json();

        if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 });

        // Verify admin session
        const { data: { user }, error: userError } = await supabase.auth.getUser(adminToken);
        if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Nível de acesso insuficiente.' }, { status: 403 });
        }

        // Delete projects → briefings → profile → auth user
        // Ignore individual errors so we clean up as much as possible
        await supabase.from('projects').delete().eq('client_id', clientId);
        await supabase.from('briefings').delete().eq('client_id', clientId);
        await supabase.from('profiles').delete().eq('id', clientId);

        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(clientId);
        if (authDeleteError) {
            console.error('Auth delete error:', authDeleteError.message);
            // Profile already deleted — return partial success
            return NextResponse.json({ success: true, warning: authDeleteError.message });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete client error:', error);
        return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
    }
}
