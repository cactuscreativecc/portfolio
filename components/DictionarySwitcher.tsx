"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "@/i18n-config";

export default function DictionarySwitcher({ currentLocale }: { currentLocale: Locale }) {
    const pathname = usePathname();

    const redirectedPathname = (locale: Locale) => {
        if (!pathname) return "/";
        const segments = pathname.split("/");
        segments[1] = locale;
        return segments.join("/");
    };

    return (
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 font-mono text-[9px] font-black tracking-tighter">
            {i18n.locales.map((locale) => {
                const isActive = currentLocale === locale;
                return (
                    <Link
                        key={locale}
                        href={redirectedPathname(locale)}
                        className={`px-3 py-1.5 transition-all duration-300 uppercase ${isActive
                                ? "bg-primary text-black"
                                : "text-neutral-600 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {locale}
                    </Link>
                );
            })}
        </div>
    );
}
