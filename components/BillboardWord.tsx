"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*";

interface BillboardWordProps {
    text: string;
}

export default function BillboardWord({ text }: BillboardWordProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);
    const iterationRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startScramble = () => {
        iterationRef.current = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                prev.split("").map((char, index) => {
                    if (index < iterationRef.current) {
                        return text[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join("")
            );

            iterationRef.current += 1 / 3;

            if (iterationRef.current >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDisplayText(text);
            }
        }, 30);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        startScramble();
    };

    return (
        <span
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-block relative cursor-default transition-colors duration-300 text-primary"
        >
            {displayText}
        </span>
    );
}
