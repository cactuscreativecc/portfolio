"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import TextReveal from "./TextReveal";

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
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24 items-start mt-8 md:mt-12 xl:mt-24 pt-8 md:pt-12 xl:pt-24 pb-16 md:pb-24 lg:pb-28 xl:pb-32 2xl:pb-40 border-t border-white/5">
            {/* Neon Background Canvas - Full Width Breakout and Extended Bottom */}
            <div className="absolute top-0 bottom-0 left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] w-screen z-0 pointer-events-none opacity-[0.06]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
            }} />

            {/* Left-Side Neon Glow (Top-Left spreading to Right) using pure CSS for exact control */}
            <div
                className="absolute top-0 bottom-0 left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] w-screen z-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 80% at left top, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 100%)"
                }}
            />

            {/* Left Side: Highlighted Text / Header */}
            <div className="relative z-10 lg:col-span-5 lg:sticky lg:top-40">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <TextReveal as="span" text={isEn ? "METHODOLOGY" : "METODOLOGIA"} className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none" />
                </div>
                <TextReveal as="h3" text={isEn ? "HOW WE <br class='hidden md:block' /> <span class='text-primary'>BUILD</span> <br class='hidden md:block' /> YOUR <span class='text-primary'>DOMAIN</span>." : "COMO NÓS <br class='hidden md:block' /> <span class='text-primary'>CONSTRUÍMOS</span> <br class='hidden md:block' /> O SEU <span class='text-primary'>DOMÍNIO</span>."} className="font-headline text-4xl md:text-6xl font-bold tracking-tight uppercase text-white leading-none" />
            </div>

            {/* Right Side: Accordion */}
            <div className="relative z-10 lg:col-span-7 flex flex-col gap-4">
                {processes.map((proc, idx) => (
                    <div
                        key={idx}
                        className={`group border transition-all duration-500 cursor-pointer overflow-hidden ${openIndex === idx ? 'bg-primary/5 border-primary/40' : 'bg-transparent border-white/10 hover:border-primary/50'
                            }`}
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                        <div className="p-6 md:p-8 flex justify-between items-center">
                            <h4 className={`font-headline text-lg md:text-xl font-bold uppercase tracking-tight transition-all duration-300 ${openIndex === idx ? 'text-primary' : 'text-white group-hover:text-primary'
                                }`}>
                                {proc.title}
                            </h4>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 ml-4 ${openIndex === idx ? 'border-primary/50 text-primary rotate-180' : 'border-white/20 text-white/50 group-hover:text-primary group-hover:border-primary/40'
                                }`}>
                                <ChevronDown size={14} />
                            </div>
                        </div>
                        <div
                            className={`px-6 md:px-8 transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-64 opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'
                                }`}
                        >
                            <p className="font-body text-sm md:text-base text-neutral-400 leading-relaxed uppercase pr-4 md:pr-12 transition-colors group-hover:text-primary/80">
                                {proc.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
