import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "URL da imagem é obrigatória" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

        if (!apiKey || apiKey === "SUA_CHAVE_AQUI") {
            return NextResponse.json({
                error: "Configuração pendente",
                message: "A chave API do Gemini não foi configurada no servidor. Por favor, adicione GOOGLE_GEMINI_API_KEY no arquivo .env."
            }, { status: 500 });
        }

        // Fetch image and convert to base64
        const imageRes = await fetch(imageUrl);
        const imageBuffer = await imageRes.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const mimeType = imageRes.headers.get('content-type') || 'image/jpeg';

        const prompt = "Você é um redator especializado em design e tecnologia. Descreva este projeto de portfólio de forma curta (máximo 150 caracteres), impactante e profissional em Português do Brasil. Foque no valor visual e técnico.";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "Erro na API do Gemini");
        }

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        return NextResponse.json({ description: generatedText });
    } catch (error: any) {
        console.error("Erro ao gerar descrição:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
