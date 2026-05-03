'use client';

import React, { useRef, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
    text: string;
    className?: string;
    as?: React.ElementType;
    delay?: number;
    once?: boolean;
    mode?: 'char' | 'word';
    style?: React.CSSProperties;
}

export default function TextReveal({
    text = "",
    className,
    as: Component = 'div',
    delay = 0,
    once = true,
    mode = 'char',
    style,
}: TextRevealProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

    const processedHTML = useMemo(() => {
        if (!text) return "";

        let result = "";
        let charIndex = 0;
        let i = 0;

        // Loop robusto para percorrer a string identificando tags HTML e texto
        while (i < text.length) {
            if (text[i] === '<') {
                // É o início de uma tag, vamos capturá-la inteira
                let tag = "";
                while (i < text.length && text[i] !== '>') {
                    tag += text[i];
                    i++;
                }
                if (i < text.length) {
                    tag += '>';
                    i++;
                }
                result += tag; // Injeta a tag original (preserva cores, classes e brs)
            } else {
                // É um bloco de texto, vamos capturar até a próxima tag
                let textBlock = "";
                while (i < text.length && text[i] !== '<') {
                    textBlock += text[i];
                    i++;
                }

                // Processamos este texto específico injetando spans de animação
                // Mantemos as palavras juntas com inline-block para evitar quebras de linha erradas
                const words = textBlock.split(/(\s+)/);

                result += words.map((word) => {
                    if (!word) return "";
                    if (/^\s+$/.test(word)) return word; // Preserva espaços

                    const revealClass = mode === 'char' ? 'cinematic-reveal-char' : 'cinematic-reveal-word';

                    if (mode === 'word') {
                        const idx = charIndex++;
                        return `<span class="${revealClass}" style="--index: ${idx}">${word}</span>`;
                    }

                    // Modo Char: envolvemos a palavra em um span para evitar quebra no meio dela
                    const chars = word.split("").map((char) => {
                        const idx = charIndex++;
                        return `<span class="${revealClass}" style="--index: ${idx}">${char}</span>`;
                    }).join("");

                    return `<span style="display: inline-block; white-space: nowrap;">${chars}</span>`;
                }).join("");
            }
        }
        return result;
    }, [text, mode]);

    if (!text) return null;

    return (
        <Component
            ref={ref}
            className={cn("text-reveal-root", className)}
            style={{
                ...style,
                "--base-delay": `${delay}s`,
                "--play-state": isInView ? 'running' : 'paused',
                "--opacity-val": isInView ? '1' : '0'
            } as any}
            dangerouslySetInnerHTML={{ __html: processedHTML }}
        />
    );
}
