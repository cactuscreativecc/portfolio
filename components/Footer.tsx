"use client";

import React from "react";
import { motion } from "framer-motion";

interface SocialLink {
    icon: string;
    label: string;
    url: string;
}

// ── SVG icon map ──────────────────────────────────────────────────────────────
function SocialIcon({ icon }: { icon: string }) {
    switch (icon) {
        case 'instagram':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
            );
        case 'youtube':
            return (
                <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                </svg>
            );
        case 'facebook':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            );
        case 'x':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            );
        case 'linkedin':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            );
        case 'tiktok':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.87a8.18 8.18 0 0 0 4.78 1.53V6.93a4.85 4.85 0 0 1-1.01-.24z" />
                </svg>
            );
        case 'whatsapp':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
            );
        case 'github':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            );
    }
}

// ── Fallback when no social links are saved in the DB ─────────────────────────
const DEFAULT_SOCIALS: SocialLink[] = [
    { icon: 'instagram', label: '@cactuscreative.cc', url: 'https://www.instagram.com/cactuscreative.cc' },
    { icon: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@cactuscreativecc' },
    { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/cactuscreativecc' },
    { icon: 'x', label: 'X', url: 'https://x.com/cactuscreativecc' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Footer({ t, socialLinks }: { t: any; socialLinks?: SocialLink[] }) {
    const links: SocialLink[] = (socialLinks && socialLinks.length > 0) ? socialLinks : DEFAULT_SOCIALS;

    return (
        <footer className="relative bg-background pt-16 md:pt-24 xl:pt-32 pb-24 md:pb-32 xl:pb-48 overflow-hidden border-t border-white/5">
            <div className="max-w-grid mx-auto px-6 md:px-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-24 xl:mb-32">

                    {/* ── Brand + Social ── */}
                    <div className="md:col-span-4 space-y-8 flex flex-col items-start">
                        <motion.a
                            href="#home"
                            className="text-3xl font-black tracking-tighter text-white flex items-center group cursor-pointer"
                        >
                            <span className="flex items-center h-5 md:h-6 pr-2">
                                <img
                                    src="/logocactuscreativecc.svg"
                                    alt="Cactus Creative"
                                    className="h-full w-auto object-left object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0_23.5%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
                                />
                            </span>
                        </motion.a>

                        <p className="font-body text-neutral-500 leading-relaxed max-w-sm uppercase">
                            {t.Footer.description}
                        </p>

                        {/* Social icons – clean minimal row */}
                        <div className="flex items-center gap-3">
                            {links.filter(s => s.url).map((social, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && (
                                        <span className="text-primary text-sm font-light select-none">/</span>
                                    )}
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label || social.icon}
                                        title={social.label || social.icon}
                                        className="text-neutral-600 hover:text-primary transition-colors duration-300"
                                    >
                                        <SocialIcon icon={social.icon} />
                                    </a>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* ── Menu ── */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">{t.Footer.menu}</h4>
                        <ul className="space-y-4 font-body text-sm text-white">
                            <li><a href="#services" className="hover:text-primary transition-colors uppercase">{t.Navigation.services}</a></li>
                            <li><a href="#methodology" className="hover:text-primary transition-colors uppercase">{t.Navigation.methodology}</a></li>
                            <li><a href="#work" className="hover:text-primary transition-colors uppercase">{t.Navigation.work}</a></li>
                            <li><a href="#tech" className="hover:text-primary transition-colors uppercase">{t.Navigation.tech}</a></li>
                            <li><a href="#about" className="hover:text-primary transition-colors uppercase">{t.Navigation.about}</a></li>
                            <li><a href="#contact" className="hover:text-primary transition-colors uppercase">{t.Navigation.contact}</a></li>
                        </ul>
                    </div>

                    {/* ── Services list ── */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">{t.Footer.services}</h4>
                        <ul className="space-y-4 font-body text-sm text-white uppercase">
                            {(t.Footer.services_list || []).map((item: string) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Contact + Hours ── */}
                    <div className="md:col-span-4 space-y-8">
                        <div>
                            <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold mb-6">{t.Footer.contact_title}</h4>
                            <div className="space-y-4 font-headline text-2xl font-bold text-white tracking-tighter">
                                <a href="mailto:contact@cactuscreative.cc" className="block hover:text-primary transition-colors">contact@cactuscreative.cc</a>
                                <div className="space-y-4 pt-4">
                                    <a href="https://wa.me/5513991862859" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 hover:text-primary transition-all">
                                        <span className="text-[10px] font-mono text-neutral-600 group-hover:text-primary">[BR]</span>
                                        <span>+55 13 99186-2859</span>
                                    </a>
                                    <a href="https://wa.me/12365153775" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 hover:text-primary transition-all">
                                        <span className="text-[10px] font-mono text-neutral-600 group-hover:text-primary">[CA]</span>
                                        <span>+1 (236) 515-3775</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h4 className="font-label text-[10px] uppercase tracking-widest text-neutral-600 font-bold">{t.Footer.operating_hours}</h4>
                            <div className="flex justify-between items-end font-mono text-[10px] text-neutral-400">
                                <div className="space-y-1">
                                    <p>{t.Footer.mon_fri}</p>
                                    <p className="text-white">08:00 — 19:00 [BRT]</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p>{t.Footer.sat_sun}</p>
                                    <p className="text-neutral-700 font-bold">{t.Footer.offline}</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                {(() => {
                                    const now = new Date();
                                    const day = now.getDay();
                                    const hour = now.getHours();
                                    const isWorkingHours = day >= 1 && day <= 5 && hour >= 8 && hour < 19;
                                    return (
                                        <div className={`inline-flex items-center gap-3 px-4 py-2 border transition-all duration-700 ${isWorkingHours ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-neutral-600 grayscale"}`}>
                                            <div className={`w-2 h-2 rounded-full ${isWorkingHours ? "bg-primary animate-pulse" : "bg-neutral-800"}`} />
                                            <span className="text-[10px] font-black tracking-[0.25em] uppercase leading-none">
                                                {isWorkingHours ? t.Footer.system_active : t.Footer.system_standby}
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="pt-8 md:pt-12 xl:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-8 font-label text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                    <p className="flex items-center gap-2">
                        {t.Footer.built_with.split('♡')[0]}
                        <span className="text-primary tracking-normal">❤</span>
                        {t.Footer.built_with.split('♡')[1]}
                    </p>
                </div>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-0 left-0 w-full select-none pointer-events-none overflow-hidden opacity-[0.04] flex justify-center translate-y-1/2">
                <h2 className="font-headline text-[11.2vw] font-black tracking-tighter leading-none whitespace-nowrap uppercase">
                    CACTUSCREATIVE
                </h2>
            </div>
        </footer>
    );
}
