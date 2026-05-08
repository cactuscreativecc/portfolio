import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "URL da imagem é obrigatória" }, { status: 400 });
        }

        const imageRes = await fetch(imageUrl);
        const imageBuffer = await imageRes.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const mimeType = imageRes.headers.get('content-type') || 'image/jpeg';

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mimeType as any,
                                data: base64Image,
                            },
                        },
                        {
                            type: "text",
                            text: "Você é um redator especializado em design e tecnologia. Descreva este projeto de portfólio de forma curta (máximo 150 caracteres), impactante e profissional em Português do Brasil. Foque no valor visual e técnico. Retorne APENAS a descrição, sem aspas."
                        }
                    ],
                }
            ],
        });

        const description = (response.content[0] as any).text.trim() || "";

        return NextResponse.json({ description });
    } catch (error: any) {
        console.error("Erro ao gerar descrição:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
