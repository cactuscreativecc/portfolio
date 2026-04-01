'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';

interface CTARevealSectionProps {
    t: {
        badge?: string;
        headline_lines?: string[];
        headline_accent_line?: number;
        button_main?: string;
        disclaimer?: string;
    };
}

/**
 * WipeLine — green bar sweeps left→right revealing text.
 * Bidireccional: progress 0→1 reveals, 1→0 hides.
 */
function WipeLine({
    children,
    progress,
    isAccent = false,
}: {
    children: React.ReactNode;
    progress: MotionValue<number>;
    isAccent?: boolean;
}) {
    const springProgress = useSpring(progress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.001
    });

    // Bar sweeps: -100% to 100%
    const barX = useTransform(springProgress, [0, 1], ['-105%', '105%']);

    // Text opacity: fully visible when bar is halfway (around 0.5)
    const textOpacity = useTransform(springProgress, [0, 0.48, 0.52, 1], [0, 0, 1, 1]);

    return (
        <div className="relative overflow-hidden block w-fit mx-auto px-4 py-1">
            <motion.span
                className={`block leading-none ${isAccent ? 'text-primary' : 'text-white'} whitespace-normal md:whitespace-nowrap text-center`}
                style={{ opacity: textOpacity }}
            >
                {children}
            </motion.span>

            {/* The single green sweep bar */}
            <motion.div
                className="absolute inset-0 bg-primary z-20 pointer-events-none h-full"
                style={{ x: barX }}
            />
        </div>
    );
}

export default function CTARevealSection({ t }: { t: any }) {
    const ref = useRef<HTMLElement>(null);

    // Objective: Everything must be revealed BEFORE the text reaches the center of the viewport.
    // 'start 95%' -> starts as it enters bottom
    // 'end 40%' -> should be fully done before it hits the center (which is 50%)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 95%', 'end 45%'],
    });

    const lines = t.headline_lines ?? [];
    const accentLine = t.headline_accent_line ?? (lines.length - 1);

    const badgeP = useTransform(scrollYProgress, [0.05, 0.20], [0, 1]);

    // Dynamic progress calculation based on number of lines
    const lineProgresses = lines.map((_: string, i: number) => {
        const start = 0.20 + (i * (0.50 / Math.max(lines.length, 1)));
        const end = start + 0.25;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useTransform(scrollYProgress, [start, Math.min(end, 0.9)], [0, 1]);
    });

    const buttonO = useTransform(scrollYProgress, [0.75, 0.90], [0, 1]);
    const disclaimO = useTransform(scrollYProgress, [0.90, 1.00], [0, 1]);

    return (
        <section
            ref={ref}
            className="relative min-h-[60vh] md:min-h-0 py-16 md:py-24 flex flex-col justify-center bg-[#0a0a0a] overflow-hidden border-t border-white/5"
        >
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [150, -150]) }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            >
                <span className="font-headline text-[40vw] md:text-[15vw] font-black tracking-tighter leading-none uppercase text-white/[0.015] whitespace-nowrap">
                    ENTREGA
                </span>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center flex flex-col items-center">
                {/* Badge */}
                <div className="mb-16">
                    <WipeLine progress={badgeP}>
                        <div className="inline-flex items-center gap-3 px-6 py-2 border border-white/10 bg-white/5">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-neutral-400 uppercase leading-none">
                                {t.badge}
                            </span>
                        </div>
                    </WipeLine>
                </div>

                {/* Headline Wrap */}
                <h2 className="font-headline text-5xl md:text-[80px] font-black tracking-tighter uppercase mb-20 md:mb-28 flex flex-col items-center gap-2 md:gap-3 w-full px-4 text-center">
                    {lines.map((line: string, i: number) => (
                        <WipeLine
                            key={i}
                            progress={lineProgresses[i]}
                            isAccent={i === accentLine}
                        >
                            <span className="text-5xl md:text-7xl lg:text-[80px] block leading-[0.95]">{line}</span>
                        </WipeLine>
                    ))}
                </h2>

                {/* Action Unit */}
                <div className="flex flex-col items-center gap-8 md:gap-12">
                    <motion.div
                        style={{ opacity: buttonO, y: useTransform(scrollYProgress, [0.7, 0.9], [40, 0]) }}
                    >
                        <button className="group relative bg-primary text-black px-10 md:px-10 py-5 md:py-5 font-black text-xs md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] uppercase overflow-hidden w-full max-w-[90vw] md:w-auto">
                            <span className="relative z-10">{t.button_main}</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                    </motion.div>

                    <motion.p
                        style={{ opacity: disclaimO }}
                        className="text-[10px] font-bold tracking-[0.4em] text-neutral-600 uppercase"
                    >
                        {t.disclaimer}
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
