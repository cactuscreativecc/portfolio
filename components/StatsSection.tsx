"use client";

import React from "react";
import { motion } from "framer-motion";
import InteractiveWaves from "./InteractiveWaves";

interface StatItem {
    val: string;
    label: string;
}

interface StatsSectionProps {
    t: {
        label: string;
        headline: string;
        cta: string;
        item1: StatItem;
        item2: StatItem;
        item3: StatItem;
        item4: StatItem;
    };
}

const colors = ["bg-red-500", "bg-[#aed500]", "bg-green-500", "bg-blue-500"];

export default function StatsSection({ t }: StatsSectionProps) {
    const stats = [t.item1, t.item2, t.item3, t.item4];

    return (
        <section className="relative py-48 px-6 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
            {/* Interactive Topographic Background - Stays still when mouse is still */}
            <InteractiveWaves />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-40 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 mb-12">
                            <div className="w-2 h-2 bg-[#aed500] animate-pulse" />
                            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant leading-none">{t.label}</span>
                        </div>
                        <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight uppercase"
                            dangerouslySetInnerHTML={{ __html: t.headline }} />
                    </motion.div>
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="px-10 py-5 bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-[#aed500] transition-colors"
                    >
                        {t.cta}
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {stats.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="relative group border-t border-white/5 pt-12"
                        >
                            <div className="flex items-center gap-6 mb-1">
                                <div className={`w-3 h-3 rounded-full ${colors[idx]} shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse`} />
                                <div className="font-headline text-7xl md:text-[7.5rem] font-bold text-white tracking-tighter leading-none">{item.val}</div>
                            </div>
                            <p className="font-body text-xl md:text-2xl text-neutral-500 uppercase tracking-tight pl-9">
                                {item.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
