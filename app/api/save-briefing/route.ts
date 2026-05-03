import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase
            .from("briefings")
            .insert({
                client_name: body.client_name ?? null,
                company: body.company ?? null,
                email: body.email ?? null,
                project_type: body.project_type ?? null,
                project_goal: body.project_goal ?? null,
                target_audience: body.target_audience ?? null,
                pages: body.pages ?? [],
                features: body.features ?? [],
                visual_references: body.visual_references ?? [],
                deadline: body.deadline ?? null,
                budget: body.budget ?? null,
                additional_notes: body.additional_notes ?? null,
                conversation_history: body.conversation_history ?? [],
                status: "novo",
            })
            .select("id")
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, id: data.id });
    } catch (error: any) {
        console.error("Save briefing error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
