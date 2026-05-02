"use client";

import React, { useState } from "react";

interface SuccessStoriesProps {
    t: any;
    siteContent?: any;
    lang?: string;
}

const TestimonialCard = ({ item }: { item: any }) => (
    <div className="bg-white/[0.03] border border-white/10 rounded-none p-6 md:p-10 flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-500 mb-8 last:mb-0">
        <p className="font-body text-sm md:text-lg text-neutral-300 leading-relaxed mb-6 md:mb-10">
            "{item.text}"
        </p>
        <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-neutral-800 border border-white/10 flex items-center justify-center font-headline font-bold text-sm text-primary">
                {item.initial}
            </div>
            <div className="space-y-0.5">
                <h4 className="font-headline text-xs font-bold text-white uppercase tracking-tight">
                    {item.author}
                </h4>
                <p className="font-label text-[8px] tracking-[0.2em] text-neutral-500 uppercase">
                    {item.role}
                </p>
            </div>
        </div>
    </div>
);

export default function SuccessStories({ t, siteContent, lang }: SuccessStoriesProps) {
    const [isPaused, setIsPaused] = useState(false);

    const testimonials = (siteContent?.success_stories && Array.isArray(siteContent.success_stories)) ? siteContent.success_stories.map((s: any) => ({
        text: (lang === 'en' && s.comment_en) ? s.comment_en : (s.comment || ""),
        author: s.name || "CLIENTE",
        role: (lang === 'en' && s.profession_en) ? s.profession_en : (s.profession || "PROJETO"),
        initial: (s.name && typeof s.name === 'string') ? s.name.substring(0, 1).toUpperCase() : "C"
    })) : [
        { author: "Marcelo Linhares", role: "CEO", initial: "M", text: "A Cactus Creative entregou muito mais que um site; eles reestruturaram a nossa comunicação digital inteira. O trato que a equipe nos deu foi excepcional do primeiro dia até a entrega, que por sinal ficou impecável." },
        { author: "Camila Rodrigues", role: "Diretora de Marketing", initial: "C", text: "Profissionalismo puro. O processo deles é super transparente, toda quarta-feira sabíamos exatamente em que pé estava o projeto. O resultado final nos trouxe enorme crescimento de leads." },
        { author: "Fernando Souza", role: "CTO", initial: "F", text: "A Cactus Creative pegou um problema técnico gigante nosso e transformou numa plataforma fluida e rápida. A paciência e clareza com que trataram nosso time foi um grande diferencial!" },
        { author: "Letícia Monteiro", role: "Founder", initial: "L", text: "Contratar a Cactus foi a melhor decisão pro nosso reposicionamento. A identidade e a interface refletem a alma do negócio. O atendimento deles? Parece que eles fazem parte da sua própria empresa." },
        { author: "Roberto Farias", role: "Head of Growth", initial: "R", text: "Não é só código e design, é estratégia pura. Mergulharam no briefing e entregaram uma máquina de vendas. Sem falar no acolhimento de toda a equipe que esteve lado a lado." },
        { author: "Heloísa Becker", role: "Product Manager", initial: "H", text: "O que mais me surpreendeu na Cactus Creative foi o absoluto rigor com qualidade, prazos e o cuidado impecável na comunicação de todo o time." },
        { author: "Diego Ferreira", role: "Co-fundador", initial: "D", text: "Transformaram uma ideia extremamente abstrata num portal robusto e lindíssimo em tempo recorde. A capacidade técnica junto ao excelente atendimento faz deles um parceiro vitalício." },
        { author: "Carolina Mattos", role: "Ops Manager", initial: "C", text: "Impecável. Todo o fluxo de aprovação e desenvolvimento do nosso app foi guiado com uma maestria que você só encontra nas maiores agências do mundo. Recomendo sempre." },
        { author: "Ricardo Almeida", role: "Tech Lead", initial: "R", text: "Agência que não te abandona pós-deploy. A Cactus Creative nos abraçou de um jeito que poucos fazem. Estabilidade, design primoroso e muito suporte humano ao longo das sprints." },
        { author: "Juliana Silva", role: "Diretora Operacional", initial: "J", text: "A clareza técnica e o cuidado estético deles são difíceis de encontrar num lugar só. Todo o projeto rodou sem dores de cabeça, me senti muito valorizada o tempo inteiro como cliente. Brilhantes." }
    ];

    const col1 = testimonials.filter((_: any, i: number) => i % 2 === 0);
    const col2 = testimonials.filter((_: any, i: number) => i % 2 !== 0);

    return (
        <section className="py-24 md:py-40 bg-black relative overflow-hidden border-t border-white/5">
            <div className="max-w-grid mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Side: Standardized Header (5 cols) */}
                <div className="lg:col-span-5 lg:sticky lg:top-40 z-20">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">{t.Testimonials?.badge || "DEPOIMENTOS"}</span>
                    </div>

                    <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight uppercase text-white mb-16"
                        dangerouslySetInnerHTML={{ __html: t.Testimonials?.headline || "HISTÓRIAS DE SUCESSO" }} />

                    <button className="hidden lg:block border-2 border-primary text-primary px-12 py-6 font-bold text-sm tracking-widest uppercase hover:bg-primary hover:text-black transition-all duration-500 hover:scale-105 active:scale-95">
                        {t.Testimonials?.cta || "VER MAIS"}
                    </button>
                </div>

                {/* Right Side: Dual-Column Vertical Marquee (7 cols) */}
                <div
                    className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px] md:h-[900px] overflow-hidden relative group"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Fading Overlays */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

                    {/* Column 1 */}
                    <div
                        className="flex flex-col animate-marquee-vertical-1"
                        style={{
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                    >
                        {[...col1, ...col1].map((item: any, idx: number) => (
                            <TestimonialCard key={idx} item={item} />
                        ))}
                    </div>

                    {/* Column 2 */}
                    <div
                        className="flex flex-col mt-20 animate-marquee-vertical-2"
                        style={{
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                    >
                        {[...col2, ...col2].map((item: any, idx: number) => (
                            <TestimonialCard key={idx} item={item} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
