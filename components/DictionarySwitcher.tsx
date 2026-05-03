"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "@/i18n-config";

function LocalTimeInfo({ locale, isActive }: { locale: Locale, isActive: boolean }) {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            try {
                // Sem definir 'timeZone', a API Intl usa o fuso horário local do navegador do visitante
                const formatted = new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).format(new Date());
                setTime(formatted);
            } catch (e) {
                setTime("--:--");
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    const hour = parseInt(time.split(':')[0]);
    const isDay = hour >= 6 && hour < 18;

    return (
        <div className={`flex items-center gap-1.5 transition-all duration-500 ${isActive ? "text-primary" : "text-neutral-700"}`}>
            <span className="material-symbols-outlined text-[12px] opacity-80">
                {isDay ? 'sunny' : 'dark_mode'}
            </span>
            <span className="font-mono tabular-nums leading-none mb-[1px]">{time}</span>
        </div>
    );
}

export default function DictionarySwitcher({ currentLocale }: { currentLocale: Locale }) {
    const pathname = usePathname();

    const redirectedPathname = (locale: Locale) => {
        if (!pathname) return "/";
        const segments = pathname.split("/");
        segments[1] = locale;
        return segments.join("/");
    };

    return (
        <div className="flex items-center gap-3 font-mono text-[10px] font-black tracking-widest">
            {i18n.locales.map((locale, index) => {
                const isActive = currentLocale === locale;
                return (
                    <React.Fragment key={locale}>
                        <Link
                            href={redirectedPathname(locale)}
                            className="group flex items-center gap-1.5 transition-all duration-300"
                        >
                            {isActive && <LocalTimeInfo locale={locale} isActive={isActive} />}
                            <span className={`uppercase transition-colors ${isActive
                                ? "text-primary border-b border-primary/40"
                                : "text-neutral-600 group-hover:text-white"
                                }`}>
                                {locale}
                            </span>
                        </Link>
                        {index < i18n.locales.length - 1 && (
                            <span className="text-white opacity-30 -mx-1">/</span>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
