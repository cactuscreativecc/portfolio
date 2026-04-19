"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useInView
} from "framer-motion";

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

const colorMap: Record<number, string> = {
    0: "bg-red-600",
    1: "bg-lime-400",
    2: "bg-green-500",
    3: "bg-blue-600",
};

function AnimatedNumber({ value }: { value: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Parse number and suffix (e.g., "80+" -> 80 and "+")
    const numericPart = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const suffix = value.replace(/[0-9]/g, "");

    const count = useMotionValue(0);

    // Premium spring physics for smooth easing
    const springValue = useSpring(count, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    const display = useTransform(springValue, (latest) => Math.round(latest));

    const [showSuffix, setShowSuffix] = useState(false);

    useEffect(() => {
        if (isInView) {
            count.set(numericPart);
            // Wait for count to get close to finishing before showing suffix fade-in
            const timer = setTimeout(() => setShowSuffix(true), 1200);
            return () => clearTimeout(timer);
        }
    }, [isInView, count, numericPart]);

    return (
        <div ref={ref} className="flex items-baseline overflow-hidden">
            <motion.span className="font-headline text-5xl md:text-[6.5rem] font-black text-white tracking-tighter leading-none">
                {display}
            </motion.span>
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={showSuffix ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="font-headline text-3xl md:text-[4rem] font-black text-primary ml-1"
            >
                {suffix}
            </motion.span>
        </div>
    );
}

export default function StatsSection({ t }: StatsSectionProps) {
    const stats = [t.item1, t.item2, t.item3, t.item4];

    return (
        <section className="relative py-32 md:py-48 bg-black overflow-hidden selection:bg-primary selection:text-black">
            <div className="relative z-10 max-w-7xl mx-auto px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 md:mb-32 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                            <div className="w-2 h-2 bg-primary animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-neutral-500 uppercase leading-none">
                                {t.label}
                            </span>
                        </div>
                        <h2
                            className="font-headline text-4xl md:text-6xl font-black tracking-tight uppercase leading-[0.9] text-white"
                            dangerouslySetInnerHTML={{ __html: t.headline }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <button className="group relative px-10 py-5 bg-white text-black font-bold text-xs tracking-[0.3em] uppercase overflow-hidden transition-all hover:bg-primary">
                            <span className="relative z-10">{t.cta}</span>
                            <div className="absolute inset-0 translate-y-full bg-primary transition-transform duration-500 group-hover:translate-y-0" />
                        </button>
                    </motion.div>
                </div>

                {/* Stats Grid - Single row for Cinematic Large Screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
                    {stats.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 1,
                                delay: idx * 0.15,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="relative group flex flex-col pt-12 border-t border-white/5"
                        >
                            {/* Status Pixel Indicator */}
                            <div className="flex items-center gap-6 mb-2">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                                    className={`w-3 h-3 ${colorMap[idx]} flex-shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
                                />
                                <AnimatedNumber value={item.val} />
                            </div>

                            {/* Label - Upper/Wide */}
                            <p className="font-label text-xs md:text-[13px] text-neutral-500 font-bold uppercase tracking-[0.3em] leading-relaxed pl-9 group-hover:text-neutral-300 transition-colors">
                                {item.label}
                            </p>

                            {/* Decorative Accent */}
                            <div className="absolute top-0 left-0 w-1/4 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Watermark - Massive but subtle */}
            <div className="absolute -bottom-20 -right-20 pointer-events-none select-none opacity-[0.02] text-[25vw] font-black text-white leading-none tracking-tighter">
                DATA
            </div>
        </section>
    );
}
