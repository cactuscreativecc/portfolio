"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    onClick={scrollToTop}
                    className="fixed bottom-12 right-12 z-[100] group flex flex-col items-center gap-0 pointer-events-auto"
                >
                    <div className="bg-black/80 backdrop-blur-xl border border-primary/20 p-1 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,1)]">
                        {/* Technical Coordinates Unit */}
                        <div className="flex flex-col items-center gap-2 py-4 px-3 border-b border-white/5 transition-all group-hover:border-primary/40">
                            <span className="text-[10px] font-mono text-neutral-600 group-hover:text-primary transition-colors">COORD_Y</span>
                            <span className="text-[10px] font-headline font-black text-white tracking-widest uppercase">00.00</span>
                        </div>

                        {/* Execute Switch */}
                        <div className="w-full bg-primary hover:bg-white transition-all duration-500 py-6 px-4 flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-lg leading-none">north</span>
                        </div>

                        {/* Label Unit */}
                        <div className="py-2 w-full text-center">
                            <span className="text-[7px] font-black tracking-[0.4em] text-neutral-700 uppercase">SYS_UP</span>
                        </div>
                    </div>

                    {/* Visual Pulse Base */}
                    <div className="w-12 h-1 bg-primary/20 mt-2 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-primary shadow-[0_0_10px_#aed500]"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
