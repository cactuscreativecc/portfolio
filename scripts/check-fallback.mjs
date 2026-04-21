import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function main() {
    const clientId = '147ef19b-dd50-46c8-ad35-70021eca10fe';
    console.log(`Testing query for clientId: ${clientId}`);

    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', clientId);
    console.log("Profile data in DB:", profile);

    const { data: projects, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    console.log("Projects returned by Service Role:");
    console.log(projects);
    if (error) console.error("Error fetching projects:", error);
}
main();
