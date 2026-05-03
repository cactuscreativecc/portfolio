import React from "react";

export default function Footer({ t }: { t: any }) {
    return (
        <footer className="relative bg-background pt-16 md:pt-24 xl:pt-32 pb-24 md:pb-32 xl:pb-48 overflow-hidden border-t border-white/5">
            <div className="max-w-grid mx-auto px-6 md:px-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-24 xl:mb-32">
                    <div className="md:col-span-4 space-y-8">
                        <div className="text-3xl font-bold tracking-tighter text-white">
                            CACTUS<span className="text-primary">CREATIVE</span>
                        </div>
                        <p className="font-body text-neutral-500 leading-relaxed max-w-sm uppercase">
                            {t.Footer.description}
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/cactuscreative.cc" target="_blank" rel="noopener noreferrer" className="relative group w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white/[0.02] hover:border-primary/50 transition-all overflow-hidden">
                                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/40 group-hover:border-primary transition-colors" />
                                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/40 group-hover:border-primary transition-colors" />
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-neutral-400 group-hover:text-primary group-hover:scale-110 transition-all duration-500">
                                    <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="4" strokeWidth="1.5" className="group-hover:animate-pulse" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                                </svg>
                            </a>
                            <a href="mailto:contact@cactuscreative.cc" className="relative group w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white/[0.02] hover:border-primary/50 transition-all overflow-hidden">
                                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/40 group-hover:border-primary transition-colors" />
                                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/40 group-hover:border-primary transition-colors" />
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-neutral-400 group-hover:text-primary group-hover:scale-110 transition-all duration-500">
                                    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5" />
                                    <polyline points="3 7 12 13 21 7" strokeWidth="1.5" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">{t.Footer.menu}</h4>
                        <ul className="space-y-4 font-body text-sm text-white">
                            <li><a href="/#services" className="hover:text-primary transition-colors uppercase">{t.Navigation.services}</a></li>
                            <li><a href="/#methodology" className="hover:text-primary transition-colors uppercase">{t.Navigation.methodology}</a></li>
                            <li><a href="/#work" className="hover:text-primary transition-colors uppercase">{t.Navigation.work}</a></li>
                            <li><a href="/#tech" className="hover:text-primary transition-colors uppercase">{t.Navigation.tech}</a></li>
                            <li><a href="/#about" className="hover:text-primary transition-colors uppercase">{t.Navigation.about}</a></li>
                            <li><a href="/#contact" className="hover:text-primary transition-colors uppercase">{t.Navigation.contact}</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">{t.Footer.services}</h4>
                        <ul className="space-y-4 font-body text-sm text-white uppercase">
                            {(t.Footer.services_list || []).map((item: string) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

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

                <div className="pt-8 md:pt-12 xl:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-8 font-label text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                    <p className="flex items-center gap-2">
                        {t.Footer.built_with.split('♡')[0]}
                        <span className="text-primary tracking-normal">❤</span>
                        {t.Footer.built_with.split('♡')[1]}
                    </p>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full select-none pointer-events-none overflow-hidden opacity-[0.04] flex justify-center translate-y-1/2">
                <h2 className="font-headline text-[11.2vw] font-black tracking-tighter leading-none whitespace-nowrap uppercase">
                    CACTUSCREATIVE
                </h2>
            </div>
        </footer>
    );
}
