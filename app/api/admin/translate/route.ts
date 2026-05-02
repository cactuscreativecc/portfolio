import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, targetLang = "en" } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
        }

        const langpair = targetLang === 'en' ? 'pt|en' : 'en|pt';
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails || "Erro na tradução");
        }

        const translatedText = data.responseData?.translatedText?.trim() || "";

        if (!translatedText) {
            throw new Error("Tradução retornou vazia");
        }

        return NextResponse.json({ translatedText });
    } catch (error: any) {
        console.error("Erro ao traduzir:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
