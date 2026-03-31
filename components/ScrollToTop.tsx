"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress, scrollY } = useScroll();

    // Smooth transform for the digital readout
    const [displayY, setDisplayY] = useState(0);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const updateCoords = () => {
            setDisplayY(window.pageYOffset);
        };

        window.addEventListener("scroll", toggleVisibility);
        window.addEventListener("scroll", updateCoords);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
            window.removeEventListener("scroll", updateCoords);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[100] group"
                >
                    {/* HUD Tactical Container */}
                    <div className="relative p-4 border border-primary/30 bg-background/80 backdrop-blur-xl flex flex-col items-start gap-3 min-w-[120px] overflow-hidden">

                        {/* Background Scanning Animation */}
                        <motion.div
                            className="absolute inset-0 bg-primary/5 -z-10"
                            animate={{ opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Top Indicator */}
                        <div className="flex justify-between w-full items-center">
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-primary" />
                                <div className="w-1 h-1 bg-primary/20" />
                            </div>
                            <span className="font-label text-[8px] text-primary/60 tracking-widest uppercase">UP_NAV</span>
                        </div>

                        {/* Coordinate Data Area */}
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-label text-[8px] text-neutral-600 uppercase">Axis_Y</span>
                                <span className="font-mono text-xs font-bold text-white tracking-widest">
                                    {displayY.toFixed(2).padStart(7, '0')}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-label text-[8px] text-neutral-600 uppercase">Depth</span>
                                <span className="font-mono text-[10px] text-primary font-black">
                                    {(displayY / 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {/* Interactive Trigger */}
                        <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-primary origin-left"
                                style={{ scaleX: scrollYProgress }}
                            />
                        </div>

                        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <span className="font-headline text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-primary">System Reset</span>
                            <span className="material-symbols-outlined text-xs">north</span>
                        </div>
                    </div>

                    {/* Corner Borders [Brutalist Decoration] */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
