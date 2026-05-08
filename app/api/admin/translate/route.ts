import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
    try {
        const { text, targetLang = "en" } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
        }

        const direction = targetLang === 'en' ? 'Português para Inglês' : 'Inglês para Português';

        const prompt = `Traduza o seguinte texto de ${direction}. Retorne APENAS a tradução, sem explicações ou textos extras.\n\nTexto:\n${text}`;

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
        });

        const translatedText = (response.content[0] as any).text.trim() || "";

        return NextResponse.json({ translatedText });
    } catch (error: any) {
        console.error("Erro ao traduzir:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
