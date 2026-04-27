'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IDLE_TIMEOUT_MS = 5000;

const WA_CHANNELS = [
    {
        label: 'BR',
        display: '+55 13 99186-2859',
        href: 'https://wa.me/5513991862859?text=Ol%C3%A1%20CactusCreative!%20Gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20engenharia%20digital.',
    },
    {
        label: 'CA',
        display: '+1 (236) 515-3775',
        href: "https://wa.me/12365153775?text=Hello%20CactusCreative!%20I'd%20like%20to%20know%20more%20about%20your%20digital%20engineering%20solutions.",
    },
];

export default function IdleWhatsApp() {
    const [isIdle, setIsIdle] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = () => {
        setIsIdle(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT_MS);
    };

    useEffect(() => {
        // Start timer on mount
        timerRef.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT_MS);

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((e) => window.removeEventListener(e, resetTimer));
        };
    }, []);

    return (
        <AnimatePresence>
            {isIdle && (
                <motion.div
                    key="idle-whatsapp"
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3"
                >
                    {/* Pulsing label */}
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-[9px] font-black tracking-[0.4em] text-neutral-500 uppercase"
                    >
                        FALE CONOSCO AGORA
                    </motion.div>

                    {/* Card */}
                    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl px-6 py-5 flex gap-4 shadow-2xl shadow-black/60">
                        {WA_CHANNELS.map((ch) => (
                            <a
                                key={ch.label}
                                href={ch.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-primary hover:border-primary transition-all duration-300"
                            >
                                {/* WhatsApp icon */}
                                <svg
                                    viewBox="0 0 32 32"
                                    className="w-4 h-4 fill-primary group-hover:fill-black transition-colors shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.773L0 32l8.469-2.004A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.293 22.293c-.344.967-2.008 1.844-2.773 1.957-.716.107-1.618.152-2.609-.163--.602-.193-1.374-.451-2.364-.883-4.158-1.795-6.875-5.969-7.083-6.244-.207-.274-1.687-2.244-1.687-4.283s1.068-3.04 1.447-3.456c.379-.416.826-.52 1.102-.52l.793.015c.254.012.597-.097.935.713l1.207 2.924c.098.237.163.515.007.829-.155.315-.233.51-.461.786-.229.275-.48.616-.686.828-.229.233-.467.486-.2.956.267.468 1.187 1.961 2.549 3.176 1.751 1.56 3.228 2.041 3.696 2.275.468.233.741.194 1.015-.116.275-.311 1.169-1.365 1.48-1.833.311-.468.622-.39 1.05-.234l3.008 1.419c.354.168.591.252.677.39.086.14.086.805-.259 1.773z" />
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black tracking-widest text-neutral-500 group-hover:text-black/60 uppercase transition-colors">
                                        [{ch.label}]
                                    </span>
                                    <span className="text-xs font-bold text-white group-hover:text-black tracking-tight transition-colors whitespace-nowrap">
                                        {ch.display}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Bottom glow line */}
                    <motion.div
                        animate={{ scaleX: [0.4, 1, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-px w-32 bg-primary/40 rounded-full"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
