'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';

interface CTARevealSectionProps {
    t: {
        bg_word?: string;
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
        <div className="relative overflow-hidden block w-fit max-w-[calc(100vw-3rem)] mx-auto px-4 py-1">
            <motion.span
                className={`block leading-none ${isAccent ? 'text-primary' : 'text-white'} whitespace-nowrap text-center`}
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

    // Objective: Reveal each line precisely when it's approaching the center of the screen
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 90%', 'end 10%'],
    });

    const lines = t.headline_lines ?? [];
    const accentLine = t.headline_accent_line ?? (lines.length - 1);

    const badgeP = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

    // Dynamic progress calculation based on 3 lines
    // Adjusted to end the sweep well before the center (0.45 progress)
    const lineProgresses = lines.map((_: string, i: number) => {
        const start = 0.05 + (i * 0.12); // Early start for transparency
        const end = start + 0.28;       // Fast and tight sweep
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useTransform(scrollYProgress, [start, end], [0, 1]);
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
                <span className="font-headline text-[50vw] md:text-[25vw] font-black tracking-tighter leading-none uppercase text-white/[0.015] whitespace-nowrap">
                    {t.bg_word ?? 'DELIVER'}
                </span>
            </motion.div>

            <div className="relative z-10 max-w-grid mx-auto px-6 md:px-16 text-center flex flex-col items-center">
                {/* Badge */}
                <div className="mb-16">
                    <WipeLine progress={badgeP}>
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">
                                {t.badge}
                            </span>
                        </div>
                    </WipeLine>
                </div>

                {/* Headline Wrap */}
                <h2 className="font-headline font-black tracking-tighter uppercase mb-20 md:mb-28 flex flex-col items-center gap-2 md:gap-3 w-full px-4 text-center">
                    {lines.map((line: string, i: number) => (
                        <WipeLine
                            key={i}
                            progress={lineProgresses[i]}
                            isAccent={i === accentLine}
                        >
                            <span className="block leading-[0.95]" style={{ fontSize: 'clamp(28px, 6.5vw, 100px)' }}>{line}</span>
                        </WipeLine>
                    ))}
                </h2>

            </div>
        </section>
    );
}
