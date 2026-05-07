import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

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

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            },
            {
                text: "Você é um redator especializado em design e tecnologia. Descreva este projeto de portfólio de forma curta (máximo 150 caracteres), impactante e profissional em Português do Brasil. Foque no valor visual e técnico. Retorne APENAS a descrição, sem aspas."
            }
        ]);

        const response = await result.response;
        const description = response.text().trim() || "";

        return NextResponse.json({ description });
    } catch (error: any) {
        console.error("Erro ao gerar descrição:", error);
        return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
    }
}
