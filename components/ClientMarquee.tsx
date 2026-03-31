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
        <div className="w-full mt-32 overflow-hidden py-12 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <p className="font-label text-[10px] tracking-[0.4em] text-neutral-600 uppercase text-center font-bold">
                    {title}
                </p>
            </div>

            <div className="relative flex">
                <motion.div
                    className="flex gap-20 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        ease: "linear",
                        duration: 35,
                        repeat: Infinity
                    }}
                >
                    {[...CLIENTS, ...CLIENTS].map((client, i) => (
                        <span
                            key={i}
                            className="font-headline text-2xl md:text-3xl font-black text-neutral-800 tracking-tighter hover:text-primary transition-colors cursor-default"
                        >
                            {client}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
