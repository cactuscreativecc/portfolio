"use client";

import React, { useState } from "react";

export default function ProcessAccordion({ lang }: { lang: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const isEn = lang === "en";

    const processes = [
        {
            title: isEn ? "01 // BRIEFING & DISCOVERY" : "01 // BRIEFING & DESCOBERTA",
            content: isEn
                ? "We dive deep into your business. We understand your goals, target audience, and technical challenges. The result is a transparent scope and surgical strategy."
                : "Mergulhamos profundamente no seu negócio. Entendemos seus objetivos, público-alvo e os desafios técnicos. O resultado é um escopo transparente e uma estratégia cirúrgica."
        },
        {
            title: isEn ? "02 // CREATION & UI/UX" : "02 // CRIAÇÃO & UI/UX",
            content: isEn
                ? "We map out the information architecture and wireframes, followed by high-fidelity visual design. The focus is always on premium aesthetics paired with maximum conversion."
                : "Trabalhamos na arquitetura de informação e wireframes, seguidos pelo design visual de alta fidelidade. O foco é sempre em estética premium aliada à máxima conversão."
        },
        {
            title: isEn ? "03 // PRODUCTION & ENGINEERING" : "03 // PRODUÇÃO & ENGENHARIA",
            content: isEn
                ? "Our technical team kicks into gear building scalable systems, fluid animations, and robust infrastructure. Every pixel and line of code is written for peak performance."
                : "Nossa equipe técnica entra em ação construindo sistemas escaláveis, animações fluidas e infraestrutura robusta. Cada pixel e linha de código é escrito visando performance."
        },
        {
            title: isEn ? "04 // DELIVERY & SUPPORT" : "04 // ENTREGA & SUSTENTAÇÃO",
            content: isEn
                ? "We deploy with rigorous testing for a flawless launch. Post-delivery, we guarantee the necessary support so your product continues to gain traction and evolve."
                : "Fazemos o deploy com testes rigorosos para um lançamento perfeito. Após a entrega, garantimos o suporte necessário para que seu produto continue tracionando e evoluindo."
        }
    ];

    return (
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mt-16 md:mt-24 pt-16 md:pt-24 border-t border-white/5">
            {/* Left Side: Highlighted Text / Header */}
            <div className="lg:col-span-5 lg:sticky lg:top-40">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">
                        {isEn ? "METHODOLOGY" : "METODOLOGIA"}
                    </span>
                </div>
                <h3 className="font-headline text-4xl md:text-5xl font-bold tracking-tight uppercase text-white leading-none">
                    {isEn ? "HOW WE" : "COMO NÓS"}<br className="hidden md:block" /> <span className="text-primary">{isEn ? "BUILD" : "CONSTRUÍMOS"}</span> <br className="hidden md:block" /> {isEn ? "YOUR DOMAIN." : "O SEU DOMÍNIO."}
                </h3>
            </div>

            {/* Right Side: Accordion */}
            <div className="lg:col-span-7 flex flex-col gap-4">
                {processes.map((proc, idx) => (
                    <div
                        key={idx}
                        className={`group border transition-all duration-500 cursor-pointer overflow-hidden ${openIndex === idx ? 'bg-white/5 border-primary/30' : 'bg-transparent border-white/10 hover:border-white/30'
                            }`}
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                        <div className="p-6 md:p-8 flex justify-between items-center">
                            <h4 className={`font-headline text-lg md:text-xl font-bold uppercase tracking-tight transition-colors ${openIndex === idx ? 'text-primary' : 'text-white group-hover:text-neutral-300'
                                }`}>
                                {proc.title}
                            </h4>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 ml-4 ${openIndex === idx ? 'border-primary/50 text-primary rotate-180' : 'border-white/20 text-white/50 group-hover:text-white group-hover:border-white/40'
                                }`}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d={openIndex === idx ? "M5 15l7-7 7-7" : "M19 9l-7 7-7-7"} />
                                </svg>
                            </div>
                        </div>
                        <div
                            className={`px-6 md:px-8 transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-64 opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'
                                }`}
                        >
                            <p className="font-body text-sm md:text-base text-neutral-400 leading-relaxed uppercase pr-4 md:pr-12">
                                {proc.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
