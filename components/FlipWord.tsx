"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface FlipWordProps {
    text: string;
}

export default function FlipWord({ text }: FlipWordProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-flex cursor-default overflow-hidden align-bottom relative"
            style={{ perspective: "1000px" }}
        >
            <motion.span
                className="relative inline-flex"
                initial={false}
                animate={{
                    rotateX: isHovered ? 360 : 0,
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.65, 0, 0.35, 1],
                }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {text.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        className="relative inline-block"
                        animate={{
                            color: isHovered ? "#aed500" : "#ffffff",
                        }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.span>
        </span>
    );
}
