import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Fetching all projects:");
    const { data: projects, error: err1 } = await supabase.from('projects').select('*');
    if (err1) {
        console.error(err1);
    } else {
        console.log(projects);
    }

    console.log("\nFetching all profiles:");
    const { data: profiles, error: err2 } = await supabase.from('profiles').select('*');
    if (err2) {
        console.error(err2);
    } else {
        console.log(profiles);
    }
}

main();
