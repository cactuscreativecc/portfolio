import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, targetLang = "en" } = await req.json();
        console.log(`[Translate API] Recebido texto para tradução: "${text}" para o idioma: ${targetLang}`);

        if (!text) {
            return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

        if (!apiKey || apiKey === "SUA_CHAVE_AQUI") {
            // Fallback for development if key is missing
            console.warn("GOOGLE_GEMINI_API_KEY não configurada. Retornando texto original.");
            return NextResponse.json({ translatedText: text + " [MISSING_API_KEY]" });
        }

        const prompt = `Você é um tradutor profissional. Traduza o seguinte texto de Português para ${targetLang === 'en' ? 'Inglês' : 'Português'}. Mantenha o tom profissional e natural. Retorne APENAS a tradução, sem comentários extras.\n\nTexto:\n${text}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.1,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "Erro na API do Gemini");
        }

        const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        return NextResponse.json({ translatedText });
    } catch (error: any) {
        console.error("Erro ao traduzir:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
