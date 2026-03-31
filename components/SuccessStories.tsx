"use client";

import React, { useState } from "react";

interface SuccessStoriesProps {
    t: any;
}

const TestimonialCard = ({ item }: { item: any }) => (
    <div className="bg-white/[0.03] border border-white/10 rounded-none p-10 flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-500 mb-8 last:mb-0">
        <p className="font-body text-base md:text-xl text-neutral-300 leading-relaxed mb-10">
            "{item.text}"
        </p>
        <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-neutral-800 border border-white/10 flex items-center justify-center font-headline font-bold text-sm text-primary">
                {item.initial}
            </div>
            <div className="space-y-0.5">
                <h4 className="font-headline text-sm font-bold text-white uppercase tracking-tight">
                    {item.author}
                </h4>
                <p className="font-label text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                    {item.role}
                </p>
            </div>
        </div>
    </div>
);

export default function SuccessStories({ t }: SuccessStoriesProps) {
    const [isPaused, setIsPaused] = useState(false);

    const testimonials = [
        { ...t.Testimonials.item1, initial: "MM" },
        { ...t.Testimonials.item2, initial: "ML" },
        { ...t.Testimonials.item3, initial: "RS" },
        { ...t.Testimonials.item4, initial: "JF" },
        { ...t.Testimonials.item5, initial: "FK" },
        { ...t.Testimonials.item6, initial: "AR" },
    ];

    const col1 = testimonials.filter((_, i) => i % 2 === 0);
    const col2 = testimonials.filter((_, i) => i % 2 !== 0);

    return (
        <section className="py-40 px-6 bg-black relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                {/* Left Side: Standardized Header (5 cols) */}
                <div className="lg:col-span-5 lg:sticky lg:top-40 z-20">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 mb-8">
                        <div className="w-2 h-2 bg-primary animate-pulse" />
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant leading-none">{t.Testimonials?.badge || "DEPOIMENTOS"}</span>
                    </div>

                    <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight uppercase text-white mb-16"
                        dangerouslySetInnerHTML={{ __html: t.Testimonials?.headline || "HISTÓRIAS DE SUCESSO" }} />

                    <button className="hidden lg:block border-2 border-primary text-primary px-12 py-6 font-bold text-sm tracking-widest uppercase hover:bg-primary hover:text-black transition-all duration-500 hover:scale-105 active:scale-95">
                        {t.Testimonials?.cta || "VER MAIS"}
                    </button>
                </div>

                {/* Right Side: Dual-Column Vertical Marquee (7 cols) */}
                <div
                    className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 h-[900px] overflow-hidden relative group"
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
                        {[...col1, ...col1].map((item, idx) => (
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
                        {[...col2, ...col2].map((item, idx) => (
                            <TestimonialCard key={idx} item={item} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
