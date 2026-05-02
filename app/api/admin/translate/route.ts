import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
    try {
        const { text, targetLang = "en" } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
        }

        const direction = targetLang === 'en' ? 'Portuguese to English' : 'English to Portuguese';

        const message = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: `Translate the following text from ${direction}. Return ONLY the translation, no explanations or extra text.\n\n${text}`
            }]
        });

        const translatedText = (message.content[0] as { type: string; text: string }).text?.trim() || "";

        return NextResponse.json({ translatedText });
    } catch (error: any) {
        console.error("Erro ao traduzir:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
