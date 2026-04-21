import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Adding a debug policy to see if RLS is the issue...");

    // We can just query projects via the Anon key to see what we get when we explicitly pass a user's JWT.
    // Instead of doing that, let's just log what we see for the user.
    console.log("Logging in as the client to test RLS...");
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'cliente@gocaseviagens.com.br',
        password: '123' // assuming this is the password you gave, if not I will just use service role to execute SQL or issue queries directly.
    });

    if (error) {
        console.error("Login error (skipping RLS test):", error.message);
    } else {
        console.log("Logged in! Fetching projects as client...");
        const clientJwt = data.session.access_token;

        const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
            global: { headers: { Authorization: `Bearer ${clientJwt}` } }
        });

        const { data: projs, error: projsErr } = await anonClient.from('projects').select('*');
        console.log("Projects fetched by client:", projs);
        console.log("Error:", projsErr);
    }
}

main();
