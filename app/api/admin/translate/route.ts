import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

export async function POST(req: Request) {
    try {
        const { text, targetLang = "en" } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
        }

        const direction = targetLang === 'en' ? 'Português para Inglês' : 'Inglês para Português';

        const prompt = `Traduza o seguinte texto de ${direction}. Retorne APENAS a tradução, sem explicações ou textos extras.\n\nTexto:\n${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text().trim() || "";

        return NextResponse.json({ translatedText });
    } catch (error: any) {
        console.error("Erro ao traduzir:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
