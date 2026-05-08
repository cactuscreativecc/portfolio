import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const lead = await req.json();

        // Verificar se é admin (simplificado por conta do middleware/token se for o caso)
        // No sistema atual, as chamadas de admin costumam passar o token ou serem validadas

        const { data, error } = await supabase
            .from('prospects')
            .insert([{
                name: lead.name,
                niche: lead.niche,
                region: lead.region,
                country: lead.country,
                website: lead.website,
                phone: lead.phone,
                address: lead.address,
                rating: lead.rating,
                metadata: {
                    tech_status: lead.tech,
                    google_rating: lead.google_rating,
                    place_id: lead.place_id
                }
            }])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Erro ao salvar prospect:", error);
        return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
    }
}
