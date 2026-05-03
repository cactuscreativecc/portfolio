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
                    className="fixed bottom-6 right-6 z-[100] group"
                >
                    {/* HUD Tactical Container */}
                    <div className="relative p-2.5 px-3 border border-primary/20 bg-background/90 backdrop-blur-md flex flex-col items-start gap-1.5 min-w-[100px] overflow-hidden">

                        {/* Background Scanning Animation */}
                        <motion.div
                            className="absolute inset-0 bg-primary/5 -z-10"
                            animate={{ opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Top Indicator */}
                        <div className="flex justify-between w-full items-center mb-0.5">
                            <div className="flex gap-1">
                                <div className="w-[3px] h-[3px] bg-primary" />
                                <div className="w-[3px] h-[3px] bg-primary/20" />
                            </div>
                            <span className="font-label text-[6px] text-primary/60 tracking-widest uppercase">UP_NAV</span>
                        </div>

                        {/* Coordinate Data Area */}
                        <div className="space-y-0.5 w-full">
                            <div className="flex justify-between items-baseline gap-3 w-full">
                                <span className="font-label text-[7px] text-neutral-600 uppercase">Axis_Y</span>
                                <span className="font-mono text-[9px] font-bold text-white tracking-widest">
                                    {displayY.toFixed(0).padStart(4, '0')}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline gap-3 w-full">
                                <span className="font-label text-[7px] text-neutral-600 uppercase">Depth</span>
                                <span className="font-mono text-[9px] text-primary font-black tracking-widest">
                                    {(displayY / 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {/* Interactive Trigger */}
                        <div className="w-full h-[1px] rounded-full bg-white/5 relative overflow-hidden my-0.5">
                            <motion.div
                                className="absolute inset-0 bg-primary origin-left"
                                style={{ scaleX: scrollYProgress }}
                            />
                        </div>

                        <div className="flex items-center justify-between w-full pt-0.5 group-hover:text-primary transition-colors">
                            <span className="font-headline text-[8px] font-black uppercase tracking-[0.2em] text-white group-hover:text-primary whitespace-nowrap">Sys.Reset</span>
                            <span className="material-symbols-outlined text-[10px]">north</span>
                        </div>
                    </div>

                    {/* Corner Borders [Brutalist Decoration] */}
                    <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-primary" />
                    <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-primary" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
