"use client";

import React from "react";
import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

export interface ClientType {
    name: string;
    logoUrl?: string;
}

const DEFAULT_CLIENTS: ClientType[] = [
    { name: "AETHERA" },
    { name: "NEXUS GLOBAL" },
    { name: "VOLARE" },
    { name: "CORE FISICO" },
    { name: "GOSAFE" },
    { name: "HYPERION" },
    { name: "NOVA ARCH" }
];

interface ClientMarqueeProps {
    title: string;
    clients?: ClientType[];
}

export default function ClientMarquee({ title, clients }: ClientMarqueeProps) {
    const actualClients = clients && clients.length > 0 ? clients : DEFAULT_CLIENTS;

    return (
        <div className="w-full mt-4 overflow-hidden py-8 flex items-center justify-center bg-transparent border-t border-white/5">
            <div className="max-w-grid mx-auto px-6 md:px-16 w-full flex flex-col md:flex-row items-center gap-6 md:gap-12">

                {/* Labels Hub - Atomic Centering with Grid Alignment */}
                <div className="flex-shrink-0 flex w-full md:w-auto items-center justify-center md:justify-start gap-4 md:gap-8 relative z-10 bg-background md:pr-10 py-4">
                    <div className="font-label text-base tracking-[0.4em] text-neutral-500 uppercase font-bold whitespace-nowrap leading-none">
                        <TextReveal text={title} />
                    </div>
                    {/* Tactical Vertical Line */}
                    <div className="hidden md:block w-[1px] h-3 bg-white/20" />
                </div>

                {/* Infinite Flow - Vertical Centering Refined */}
                <div className="relative flex flex-grow overflow-hidden items-center h-full w-full">
                    <motion.div
                        className="flex gap-24 whitespace-nowrap items-center"
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{
                            ease: "linear",
                            duration: 80,
                            repeat: Infinity
                        }}
                    >
                        {/* Duplicate for Seamless Integration */}
                        {[...actualClients, ...actualClients].map((client, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center object-contain"
                            >
                                {client.logoUrl ? (
                                    <img
                                        src={client.logoUrl}
                                        alt={client.name}
                                        className="h-16 md:h-20 w-auto object-contain max-w-[180px] opacity-40 brightness-0 invert hover:opacity-100 transition-opacity duration-500"
                                    />
                                ) : (
                                    <span className="font-headline text-3xl md:text-4xl font-black text-neutral-500 tracking-tighter uppercase cursor-default hover:text-white transition-colors duration-300 flex items-center">
                                        {client.name}
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.div>

                    {/* Optical Fade Edges */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
                </div>

            </div>
        </div>
    );
}
