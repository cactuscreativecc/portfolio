"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: "xs" | "sm" | "md" | "lg";
}

export function Component({ className, size = "md" }: LoaderProps) {
    return (
        <div className={cn(
            "c-loader flex items-center justify-center",
            size === "xs" && "scale-[0.2]",
            size === "sm" && "scale-[0.4]",
            size === "md" && "scale-[0.8]",
            size === "lg" && "scale-100",
            className
        )}>
            <svg viewBox="0 0 80 80" className="c-loader-svg">
                <rect height="64" width="64" y="8" x="8" className="c-loader-rect"></rect>
            </svg>
        </div>
    );
}
