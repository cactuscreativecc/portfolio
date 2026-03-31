"use client";

import React from "react";
import { motion } from "framer-motion";

const CLIENTS = [
    "AETHERA", "NEXUS GLOBAL", "VOLARE", "CORE FISICO", "GOSAFE", "HYPERION", "NOVA ARCH"
];

interface ClientMarqueeProps {
    title: string;
}

export default function ClientMarquee({ title }: ClientMarqueeProps) {
    return (
        <div className="w-full mt-4 overflow-hidden py-8 flex items-center justify-center bg-transparent">
            <div className="max-w-7xl mx-auto w-full flex items-center gap-12">

                {/* Labels Hub - Atomic Centering with Grid Alignment */}
                <div className="flex-shrink-0 flex items-center gap-8 relative z-10 bg-background pr-10">
                    <p className="font-label text-[9px] tracking-[0.4em] text-neutral-600 uppercase font-bold whitespace-nowrap leading-none">
                        {title}
                    </p>
                    {/* Tactical Vertical Line */}
                    <div className="w-[1px] h-3 bg-white/20" />
                </div>

                {/* Infinite Flow - Vertical Centering Refined */}
                <div className="relative flex flex-grow overflow-hidden items-center h-full">
                    <motion.div
                        className="flex gap-24 whitespace-nowrap items-center"
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{
                            ease: "linear",
                            duration: 8, // Drastically reduced for maximum speed flow
                            repeat: Infinity
                        }}
                    >
                        {/* Duplicate for Seamless Integration */}
                        {[...CLIENTS, ...CLIENTS].map((client, i) => (
                            <span
                                key={i}
                                className="font-headline text-lg md:text-xl font-black text-neutral-800 tracking-tighter uppercase cursor-default hover:text-primary transition-colors duration-300 flex items-center"
                            >
                                {client}
                            </span>
                        ))}
                    </motion.div>

                    {/* Optical Fade Edges */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
                </div>

            </div>
        </div>
    );
}
