"use client";

import React, { useEffect, useRef } from "react";

export default function InteractiveWaves() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -1000, y: -1000, active: false });
    const points = useRef<{ x: number, y: number, originX: number, originY: number }[]>([]);
    const frame = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrame: number;
        const spacingX = 12; // Higher resolution for smoother curves
        const spacingY = 12;
        const influenceRadius = 400; // Softer falloff
        const ease = 0.04;
        const strength = 0.4;

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            points.current = [];

            for (let y = -spacingY; y < canvas.height + spacingY * 2; y += spacingY) {
                for (let x = -spacingX; x < canvas.width + spacingX * 2; x += spacingX) {
                    points.current.push({ x, y, originX: x, originY: y });
                }
            }
        };

        const draw = () => {
            if (!ctx || !canvas) return;
            frame.current += 0.005; // Slow time for organic drift

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"; // DARKER: Almost invisible obsidian gray
            ctx.lineWidth = 0.6;

            const cols = Math.ceil((canvas.width + spacingX * 2) / spacingX) + 1;
            const rows = Math.ceil((canvas.height + spacingY * 2) / spacingY) + 1;

            // Update Points Physics
            points.current.forEach(p => {
                // Base organic drift (Sine waves for natural feel)
                const driftX = Math.sin(frame.current + p.originY * 0.01) * 15;
                const driftY = Math.cos(frame.current + p.originX * 0.01) * 10;

                const targetX_Base = p.originX + driftX;
                const targetY_Base = p.originY + driftY;

                const dx = mouse.current.x - p.originX;
                const dy = mouse.current.y - p.originY;
                const distSq = dx * dx + dy * dy;
                const radiusSq = influenceRadius * influenceRadius;

                if (distSq < radiusSq) {
                    const falloff = Math.exp(-distSq / (radiusSq / 1.5));
                    const angle = Math.atan2(dy, dx);

                    const tx = targetX_Base - Math.cos(angle) * influenceRadius * falloff * strength;
                    const ty = targetY_Base - Math.sin(angle) * influenceRadius * falloff * strength;

                    p.x += (tx - p.x) * ease;
                    p.y += (ty - p.y) * ease;
                } else {
                    p.x += (targetX_Base - p.x) * ease;
                    p.y += (targetY_Base - p.y) * ease;
                }
            });

            // Draw with Curved Motion
            for (let j = 0; j < rows; j++) {
                ctx.beginPath();
                for (let i = 0; i < cols; i++) {
                    const p = points.current[j * cols + i];
                    if (!p) continue;

                    if (i === 0) {
                        ctx.moveTo(p.x, p.y);
                    } else {
                        const prev = points.current[j * cols + i - 1];
                        if (!prev) continue;
                        // Quadratic curve for ultra-organic flow
                        const xc = (p.x + prev.x) / 2;
                        const yc = (p.y + prev.y) / 2;
                        ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
                    }
                }
                ctx.stroke();
            }

            animationFrame = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top;
        };

        window.addEventListener("resize", init);
        window.addEventListener("mousemove", handleMouseMove);
        init();
        draw();

        return () => {
            window.removeEventListener("resize", init);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
