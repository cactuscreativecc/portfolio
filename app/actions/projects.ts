"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export async function fetchProjectsForClient(clientId: string) {
    if (!clientId) return { data: [], error: "Missing clientId" };

    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("client_id", clientId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return { data, error: null };
    } catch (error: any) {
        console.error("Server Action fetchProjectsForClient error:", error);
        return { data: [], error: error.message };
    }
}
