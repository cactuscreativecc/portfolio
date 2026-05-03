import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            email,
            client_name,
            company,
            conversation_history,
            project_type,
            project_goal,
            target_audience,
            pages,
            features,
            visual_references,
            visual_style,
            primary_color_hint,
            deadline,
            budget,
            additional_notes,
        } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        const tempPassword = crypto.randomBytes(12).toString("hex");
        let userId: string | null = null;

        // 1. Try to create auth user
        const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
                full_name: client_name || company || email.split("@")[0],
                company_name: company || null,
                source: "briefing",
            },
        });

        if (authError) {
            // User may already exist — find by email in profiles
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("email", email)
                .single();

            if (existingProfile?.id) {
                userId = existingProfile.id;
            } else {
                console.error("Auth create error:", authError.message);
                // Still continue to save briefing without client link
            }
        } else {
            userId = newUser.user.id;

            // 2. Create profile for new user
            const { error: profileError } = await supabase.from("profiles").upsert({
                id: userId,
                full_name: client_name || company || email.split("@")[0],
                email,
                company_name: company || null,
                role: "client",
                plain_password: tempPassword,
            });

            if (profileError) {
                console.error("Profile create error:", profileError.message);
            }
        }

        // 3. Save briefing (always, even if user creation failed)
        const briefingInsert: Record<string, unknown> = {
            client_name: client_name || null,
            company: company || null,
            email,
            project_type: project_type || null,
            project_goal: project_goal || null,
            target_audience: target_audience || null,
            pages: pages || [],
            features: features || [],
            visual_references: visual_references || [],
            visual_style: visual_style || null,
            primary_color_hint: primary_color_hint || null,
            deadline: deadline || null,
            budget: budget || null,
            additional_notes: additional_notes || null,
            conversation_history: conversation_history || [],
            status: "novo",
        };

        // Add client_id if we have it (column may or may not exist)
        if (userId) {
            briefingInsert.client_id = userId;
        }

        const { data: briefing, error: briefingError } = await supabase
            .from("briefings")
            .insert(briefingInsert)
            .select("id")
            .single();

        if (briefingError) {
            // If client_id column doesn't exist, retry without it
            if (briefingError.message?.includes("client_id") && userId) {
                delete briefingInsert.client_id;
                const { data: retryBriefing, error: retryError } = await supabase
                    .from("briefings")
                    .insert(briefingInsert)
                    .select("id")
                    .single();

                if (retryError) throw retryError;

                return NextResponse.json({
                    success: true,
                    briefingId: retryBriefing.id,
                    clientId: userId,
                });
            }
            throw briefingError;
        }

        // 4. Create project linked to client so admin "PROJETOS E STATUS" shows it
        if (userId) {
            const projectName = company
                ? `${company} — ${project_type || "Website"}`
                : (project_type || "Website Project");

            const { error: projectError } = await supabase.from("projects").insert({
                name: projectName,
                description: project_goal || additional_notes || null,
                client_id: userId,
                status: "Briefing & Estratégia",
                current_step: 0,
            });

            if (projectError) {
                console.error("Project create error:", projectError.message);
            }
        }

        return NextResponse.json({
            success: true,
            briefingId: briefing.id,
            clientId: userId,
        });
    } catch (error: any) {
        console.error("Briefing finalize error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
