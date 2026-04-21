import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');

    if (!clientId) {
        return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
    }

    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from("projects")
            .select("*")
            .eq("client_id", clientId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data, profileIdRequested: clientId });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
