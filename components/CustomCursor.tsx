"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface HoverState {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function CustomCursor() {
    const [hoverState, setHoverState] = useState<HoverState | null>(null);
    const [isMobile, setIsMobile] = useState(true); // Default to true to prevent glitch on hydration

    useEffect(() => {
        // Detect if it's a touch device or small screen
        const checkMobile = () => {
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            const isSmallScreen = window.innerWidth < 1024;
            setIsMobile(isTouch || isSmallScreen);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 30, stiffness: 350, mass: 0.8 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);
    const cursorWidth = useSpring(16, springConfig);
    const cursorHeight = useSpring(16, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            // If not hovering a magnetic element, follow the mouse
            if (!hoverState) {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            } else {
                // If hovering, add a slight magnetic pull towards the center but allow mouse freedom
                const pullX = e.clientX + (hoverState.x + hoverState.width / 2 - e.clientX) * 0.2;
                const pullY = e.clientY + (hoverState.y + hoverState.height / 2 - e.clientY) * 0.2;
                mouseX.set(pullX);
                mouseY.set(pullY);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a, button, [role='button'], .cursor-pointer") as HTMLElement;

            if (target) {
                const rect = target.getBoundingClientRect();
                setHoverState({
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                });

                // Match size to button
                cursorWidth.set(rect.width);
                cursorHeight.set(rect.height);
            } else {
                setHoverState(null);
                cursorWidth.set(16);
                cursorHeight.set(16);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [hoverState, mouseX, mouseY, cursorWidth, cursorHeight]);

    const trail1X = useSpring(mouseX, { damping: 25, stiffness: 200 });
    const trail1Y = useSpring(mouseY, { damping: 25, stiffness: 200 });
    const trail2X = useSpring(mouseX, { damping: 20, stiffness: 100 });
    const trail2Y = useSpring(mouseY, { damping: 20, stiffness: 100 });
    const trail3X = useSpring(mouseX, { damping: 15, stiffness: 50 });
    const trail3Y = useSpring(mouseY, { damping: 15, stiffness: 50 });

    if (isMobile) return null;

    return (
        <>
            {/* Trail Effects */}
            {!hoverState && (
                <>
                    <motion.div
                        className="fixed top-0 left-0 pointer-events-none z-[9998] w-4 h-4 rounded-full bg-primary/20"
                        style={{
                            translateX: trail1X,
                            translateY: trail1Y,
                            x: "-50%",
                            y: "-50%",
                        }}
                    />
                    <motion.div
                        className="fixed top-0 left-0 pointer-events-none z-[9997] w-3 h-3 rounded-full bg-primary/10"
                        style={{
                            translateX: trail2X,
                            translateY: trail2Y,
                            x: "-50%",
                            y: "-50%",
                        }}
                    />
                    <motion.div
                        className="fixed top-0 left-0 pointer-events-none z-[9996] w-2 h-2 rounded-full bg-primary/5"
                        style={{
                            translateX: trail3X,
                            translateY: trail3Y,
                            x: "-50%",
                            y: "-50%",
                        }}
                    />
                </>
            )}

            <motion.div
                className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] border-2 border-primary bg-primary/10"
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                    x: "-50%",
                    y: "-50%",
                    width: cursorWidth,
                    height: cursorHeight,
                }}
                animate={{
                    opacity: 1,
                    borderRadius: hoverState ? "0px" : "999px",
                }}
            >
                {/* Internal Pulse when in pointer mode */}
                {!hoverState && (
                    <motion.div
                        className="absolute inset-0 bg-primary rounded-full transition-transform"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                )}
            </motion.div>
        </>
    );
}

