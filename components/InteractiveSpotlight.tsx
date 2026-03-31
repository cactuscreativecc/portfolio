"use client";

import React, { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function InteractiveSpotlight() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Motion values for raw mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Springs for buttery smooth movement (The Secret Sauce)
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { left, top } = containerRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - left);
            mouseY.set(e.clientY - top);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        >
            {/* Interactive Light Source */}
            <motion.div
                className="absolute inset-0 z-10"
                style={{
                    background: `radial-gradient(800px circle at calc(var(--x) * 1px) calc(var(--y) * 1px), rgba(174, 213, 0, 0.12), transparent 80%)`,
                    // @ts-ignore
                    "--x": springX,
                    // @ts-ignore
                    "--y": springY,
                } as any}
            />

        </div>
    );
}
