import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Creating test user...");
    const { data: userAuth, error: authErr } = await supabase.auth.admin.createUser({
        email: 'test_client_RLS_123@cactuscreative.cc',
        password: 'password123',
        email_confirm: true
    });

    if (authErr) {
        console.error("Auth Err:", authErr);
        return;
    }

    const testUid = userAuth.user.id;
    console.log("Created test user:", testUid);

    // Create profile
    await supabase.from('profiles').insert([{ id: testUid, email: 'test_client_RLS_123@cactuscreative.cc', role: 'client', full_name: 'Test Client' }]);

    // Create project
    await supabase.from('projects').insert([{
        client_id: testUid,
        name: 'Test Project RLS',
        description: 'Testing if RLS works for clients',
        status: 'UX UI Design',
        current_step: 10
    }]);

    console.log("Data inserted. Now logging in as client to fetch...");

    // Log in
    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
        email: 'test_client_RLS_123@cactuscreative.cc',
        password: 'password123'
    });

    if (loginErr) {
        console.error("Login Err:", loginErr);
        return;
    }

    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${loginData.session.access_token}` } }
    });

    // TEST SELECT PROJECTS
    const { data: myProjects, error: fetchErr } = await anonClient.from('projects').select('*');

    console.log("=== RESULTS VIA RLS ===");
    console.log("Projects:", JSON.stringify(myProjects, null, 2));
    console.log("Error:", fetchErr);

    // Now delete the test user
    await supabase.auth.admin.deleteUser(testUid);
    console.log("Test user deleted.");
}

main();
