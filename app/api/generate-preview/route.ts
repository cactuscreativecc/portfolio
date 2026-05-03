import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
    try {
        const { briefing, selectedPalette } = await req.json();

        const prompt = `Based on this client briefing, generate a website design concept as JSON.

Briefing:
- Company: ${briefing.company}
- Project Type: ${briefing.project_type}
- Goal: ${briefing.project_goal}
- Audience: ${briefing.target_audience}
- Pages: ${briefing.pages?.join(", ")}
- Features: ${briefing.features?.join(", ")}
- Visual References: ${briefing.visual_references?.join(", ")}
- Visual Style: ${briefing.visual_style}
- Color Hint: ${briefing.primary_color_hint}

Return ONLY valid JSON (no markdown, no explanation):
{
  "palette": {
    "background": "#hex",
    "surface": "#hex",
    "primary": "#hex",
    "secondary": "#hex",
    "text": "#hex",
    "textMuted": "#hex",
    "accent": "#hex"
  },
  "style": "minimalist | bold | corporate | creative | luxury | tech",
  "typography": {
    "headingStyle": "uppercase | titlecase | mixed",
    "weight": "thin | regular | bold | black"
  },
  "sections": [
    {
      "id": "hero",
      "label": "Hero",
      "type": "hero",
      "headline": "actual headline text for this company",
      "subheadline": "actual subheadline text",
      "cta": "button label"
    },
    {
      "id": "about",
      "label": "About",
      "type": "about",
      "headline": "section title",
      "description": "2-sentence description"
    },
    {
      "id": "services",
      "label": "Services",
      "type": "grid",
      "headline": "section title",
      "items": ["Service 1", "Service 2", "Service 3"]
    }
  ],
  "hasNavbar": true,
  "hasFooter": true,
  "navItems": ["Home", "About", "Services", "Contact"]
}

Generate sections based on the pages requested: ${briefing.pages?.join(", ")}
Make the content specific to ${briefing.company} — not generic.`;

        const response = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 2048,
            messages: [{ role: "user", content: prompt }],
        });

        const text = (response.content[0] as { type: string; text: string }).text ?? "{}";

        let preview;
        try {
            preview = JSON.parse(text);
        } catch {
            const match = text.match(/\{[\s\S]*\}/);
            preview = match ? JSON.parse(match[0]) : {};
        }

        // Override palette with user selection when provided
        if (selectedPalette && typeof selectedPalette === "object") {
            preview.palette = selectedPalette;
        }

        return NextResponse.json({ preview });
    } catch (error: any) {
        console.error("Generate preview error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
