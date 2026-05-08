import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

// Esta chave deve ser configurada no .env.local
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function translateNiche(niche: string, targetLang: string) {
    if (targetLang === 'pt') return niche;

    try {
        const prompt = `Traduza o nicho de mercado "${niche}" para o idioma principal de ${targetLang}. Retorne apenas o termo traduzido em uma única linha.`;
        const result = await model.generateContent(prompt);
        return (await result.response).text().trim();
    } catch (e) {
        return niche;
    }
}

async function analyzeWebsite(url: string) {
    if (!url) return { rating: 0, tech: "Nenhum site" };

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const res = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CactusBot/1.0;)' }
        });

        clearTimeout(timeout);
        const html = await res.text();
        const headers = res.headers;

        let score = 5; // Começa como "ótimo" e vai descendo
        let reasons = [];

        // Verifica responsividade
        if (!html.includes('viewport')) {
            score -= 2;
            reasons.push("Sem meta viewport (não mobile-friendly)");
        }

        // Verifica Next.js / React
        if (html.includes('_next/static') || html.includes('react')) {
            score += 1;
        } else {
            score -= 1;
            reasons.push("Tecnologia legada ou estática");
        }

        // Verifica HTTPS
        if (!url.startsWith('https')) {
            score -= 1;
            reasons.push("Sem HTTPS");
        }

        // Verifica SEO Básico
        if (!html.includes('<title>') || !html.includes('description')) {
            score -= 1;
            reasons.push("SEO deficiente");
        }

        return {
            rating: Math.max(1, Math.min(5, score)),
            tech: reasons.length > 0 ? reasons.join(", ") : "Site Moderno"
        };
    } catch (e) {
        return { rating: 1, tech: "Inacessível ou Offline" };
    }
}

export async function POST(req: Request) {
    try {
        const { niche, region, country } = await req.json();

        if (!niche || !country) {
            return NextResponse.json({ error: "Nicho e País são obrigatórios" }, { status: 400 });
        }

        // 1. Tradução automática do nicho
        const translatedNiche = await translateNiche(niche, country.toLowerCase() === 'brasil' ? 'pt' : country);

        const query = `${translatedNiche} in ${region ? region + ', ' : ''}${country}`;

        // Se não houver chave da API do Google, retornamos um erro claro ou dados mockados para teste
        if (!GOOGLE_PLACES_API_KEY) {
            console.warn("GOOGLE_PLACES_API_KEY não definida. Retornando dados de exemplo.");
            return NextResponse.json({
                query,
                results: [
                    { name: "Exemplo Empresa 1", website: "http://exemplo1.com", phone: "+55 11 9999-9999", address: "Rua A, 123", rating: 2, tech: "Antigo, Sem mobile" },
                    { name: "Exemplo Empresa 2", website: "", phone: "+55 11 8888-8888", address: "Av B, 456", rating: 1, tech: "Sem site" }
                ],
                mock: true
            });
        }

        // 2. Busca no Google Places
        const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;
        const searchRes = await fetch(placesUrl);
        const searchData = await searchRes.json();

        if (searchData.status !== 'OK') {
            throw new Error(searchData.error_message || "Erro na busca do Google Places");
        }

        // 3. Processamento e Análise de Tecnologia
        const processedResults = await Promise.all(searchData.results.slice(0, 10).map(async (place: any) => {
            // Obter detalhes para pegar o website (TextSearch não retorna todos os campos)
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,website,formatted_phone_number,formatted_address&key=${GOOGLE_PLACES_API_KEY}`;
            const detailRes = await fetch(detailsUrl);
            const detailData = await detailRes.json();
            const info = detailData.result || {};

            const techAnalysis = info.website ? await analyzeWebsite(info.website) : { rating: 1, tech: "Sem site" };

            return {
                name: info.name || place.name,
                website: info.website || "",
                phone: info.formatted_phone_number || "",
                address: info.formatted_address || place.formatted_address,
                google_rating: place.rating,
                ...techAnalysis,
                place_id: place.place_id
            };
        }));

        return NextResponse.json({ query, results: processedResults });

    } catch (error: any) {
        console.error("Erro na busca de leads:", error);
        return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
    }
}
