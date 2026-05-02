require('dotenv').config({ path: '.env.local' });
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "DEFINED" : "UNDEFINED");
console.log("URL VALUE:", process.env.NEXT_PUBLIC_SUPABASE_URL);
