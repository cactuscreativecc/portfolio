import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { briefingId, briefingData, previewData } = await req.json();

        const supabase = getSupabaseAdmin();

        if (briefingId) {
            const { error } = await supabase
                .from("briefings")
                .update({ status: "aprovado", preview_config: previewData })
                .eq("id", briefingId);

            if (error) throw error;
        } else {
            const { error } = await supabase.from("briefings").insert({
                client_name: briefingData.client_name ?? null,
                company: briefingData.company ?? null,
                email: briefingData.email ?? null,
                project_type: briefingData.project_type ?? null,
                project_goal: briefingData.project_goal ?? null,
                target_audience: briefingData.target_audience ?? null,
                pages: briefingData.pages ?? [],
                features: briefingData.features ?? [],
                visual_references: briefingData.visual_references ?? [],
                deadline: briefingData.deadline ?? null,
                budget: briefingData.budget ?? null,
                additional_notes: briefingData.additional_notes ?? null,
                conversation_history: briefingData.conversation_history ?? [],
                preview_config: previewData ?? null,
                status: "aprovado",
            });

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Approve briefing error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
