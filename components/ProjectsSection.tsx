"use client";

import React, { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface Project {
    id: string;
    category: string;
    index: string;
    title: string;
    description: string;
    stat1_val: string;
    stat1_label: string;
    stat2_val: string;
    stat2_label: string;
    image: string;
    tags: string[];
    href?: string;
    url?: string;
    cta?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ProjectsSection({ t, siteContent }: { t: any; siteContent?: any }) {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const triggerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const panelsRefs = useRef<(HTMLDivElement | null)[]>([]);

    const allProjects: Project[] = useMemo(() => {
        if (siteContent?.featured_projects && Array.isArray(siteContent.featured_projects)) {
            return siteContent.featured_projects;
        }

        return [
            {
                id: "tech1", category: "TECH", index: "01",
                title: t.CaseStudies.case1?.title || "AYU PILATES",
                description: t.CaseStudies.case1?.description,
                stat1_val: "400%", stat1_label: t.CaseStudies.case1?.stat1_label,
                stat2_val: "60%", stat2_label: t.CaseStudies.case1?.stat2_label,
                image: "/jobs/1.jpg",
                tags: ["PERFORMANCE", "UI/UX", "SYSTEM"],
                cta: t.CaseStudies.case1?.cta
            },
            {
                id: "tech2", category: "TECH", index: "02",
                title: t.CaseStudies.case2?.title || "MULTINTERCÂMBIO",
                description: t.CaseStudies.case2?.description,
                stat1_val: "22X", stat1_label: t.CaseStudies.case2?.stat1_label,
                stat2_val: "1.2M", stat2_label: t.CaseStudies.case2?.stat2_label,
                image: "/jobs/2.jpg",
                tags: ["SEO", "ADS", "INFRA"],
                cta: t.CaseStudies.case2?.cta
            },
            {
                id: "tech3", category: "TECH", index: "03",
                title: t.CaseStudies.case3?.title || "MULTINTERCÂMBIO CMS",
                description: t.CaseStudies.case3?.description,
                stat1_val: "99.99%", stat1_label: t.CaseStudies.case3?.stat1_label,
                stat2_val: "2ms", stat2_label: t.CaseStudies.case3?.stat2_label,
                image: "/jobs/3.jpg",
                tags: ["BACKEND", "SECURITY", "FINTECH"],
                cta: t.CaseStudies.case3?.cta
            },
            {
                id: "tech4", category: "TECH", index: "04",
                title: t.CaseStudies.case4?.title || "CORREZERO13 LP",
                description: t.CaseStudies.case4?.description,
                stat1_val: "15X", stat1_label: t.CaseStudies.case4?.stat1_label,
                stat2_val: "32TB", stat2_label: t.CaseStudies.case4?.stat2_label,
                image: "/jobs/4.jpg",
                tags: ["AI", "ML", "AUTOMATION"],
                cta: t.CaseStudies.case4?.cta
            },
            {
                id: "design1", category: "DESIGN", index: "05",
                title: t.CaseStudies.case5?.title || "CORREZERO13 PLATFORM",
                description: t.CaseStudies.case5?.description,
                stat1_val: "88%", stat1_label: t.CaseStudies.case5?.stat1_label,
                stat2_val: "3.5X", stat2_label: t.CaseStudies.case5?.stat2_label,
                image: "/jobs/5.jpg",
                tags: ["BRUTALISM", "FASHION", "UX"],
                cta: t.CaseStudies.case5?.cta
            },
            {
                id: "design2", category: "DESIGN", index: "06",
                title: t.CaseStudies.case6?.title || "CAMPEDELLI",
                description: t.CaseStudies.case6?.description,
                stat1_val: "1.2M", stat1_label: t.CaseStudies.case6?.stat1_label,
                stat2_val: "450%", stat2_label: t.CaseStudies.case6?.stat2_label,
                image: "/jobs/6.jpg",
                tags: ["IDENTITY", "MOTION", "VISUAL"],
                cta: t.CaseStudies.case6?.cta
            },
            {
                id: "design3", category: "DESIGN", index: "07",
                title: t.CaseStudies.case7?.title || "GOSAFE",
                description: t.CaseStudies.case7?.description,
                stat1_val: "20ms", stat1_label: t.CaseStudies.case7?.stat1_label,
                stat2_val: "0.01", stat2_label: t.CaseStudies.case7?.stat2_label,
                image: "/jobs/7.jpg",
                tags: ["CRYPTO", "WEB3", "MINIMALISM"],
                cta: t.CaseStudies.case7?.cta
            },
            {
                id: "design4", category: "DESIGN", index: "08",
                title: t.CaseStudies.case8?.title || "LALABABY",
                description: t.CaseStudies.case8?.description,
                stat1_val: "32%", stat1_label: t.CaseStudies.case8?.stat1_label,
                stat2_val: "4.8", stat2_label: t.CaseStudies.case8?.stat2_label,
                image: "/jobs/8.jpg",
                tags: ["BIOPHILIC", "WORKSPACE", "APPS"],
                cta: t.CaseStudies.case8?.cta
            }
        ];
    }, [t, siteContent]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Initial states
            gsap.set(headlineRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                position: "absolute",
                top: "50%",
                left: "50%",
                xPercent: -50,
                yPercent: -50,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: `+=${(allProjects.length + 1) * 150}%`, // Longer scroll for smoother feel
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        // Manual update for progress bar if preferred, or include in timeline
                        gsap.set("#scroll-progress-bar", { height: `${self.progress * 100}%` });
                    }
                }
            });

            // Step 1: Headline and Progress move
            tl.to(headlineRef.current, {
                y: -300,
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            })
                .to(".progress-indicator", {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "<");

            // Step 2: Sequential reveal of project panels
            allProjects.forEach((_, i) => {
                const panel = panelsRefs.current[i];
                const bg = panel?.querySelector(".project-bg");
                const items = panel?.querySelectorAll(".stagger-item");

                if (!panel) return;

                // Bring in current panel
                tl.fromTo(panel,
                    { opacity: 0, visibility: "hidden", yPercent: 30 },
                    { opacity: 1, visibility: "visible", yPercent: 0, duration: 2.5, ease: "slow(0.7, 0.7, false)" }
                );

                // Entrance parallax for background
                if (bg) {
                    tl.fromTo(bg,
                        { scale: 1.3, transformOrigin: "center center" },
                        { scale: 1, duration: 3.5, ease: "power2.out" },
                        "<"
                    );
                }

                // Staggered items entrance
                if (items && items.length > 0) {
                    tl.fromTo(items,
                        { opacity: 0, y: 50 },
                        { opacity: 1, y: 0, stagger: 0.15, duration: 1.5, ease: "power4.out" },
                        "-=1.5"
                    );
                }

                // If not last, hold and then move out
                if (i < allProjects.length - 1) {
                    tl.to(panel, {
                        opacity: 0,
                        yPercent: -30,
                        duration: 2.5,
                        delay: 1.5,
                        ease: "power2.inOut"
                    });
                } else {
                    // Final hold for the last one
                    tl.to(panel, { duration: 2, delay: 1.5 });
                }
            });

            // Background text loop effect (optional, matching "infinite" vibe)
            // But we'll stick to the focused cinematic sequence first as requested.

        }, triggerRef);

        return () => ctx.revert();
    }, [allProjects]);

    return (
        <section ref={triggerRef} id="projects" className="relative bg-black overflow-hidden select-none">
            {/* Sticky Container for Animation */}
            <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">

                {/* 1. Intro Headline (Starting Centered) */}
                <div ref={headlineRef} className="z-[100] text-center w-full max-w-5xl px-6 pointer-events-none">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8 mx-auto">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">{t.CaseStudies?.label || "PROJETOS SELECIONADOS"}</span>
                    </div>
                    <h2 className="font-headline text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-none whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: t.CaseStudies?.headline || "ESTUDOS DE CASO" }} />
                </div>

                {/* 2. Project Panels (Absolute Stack) */}
                <div className="absolute inset-0 w-full h-full z-10">
                    {allProjects.map((project, idx) => (
                        <div
                            key={project.id || idx}
                            ref={(el) => { panelsRefs.current[idx] = el; }}
                            className="absolute inset-0 w-full h-full opacity-0 invisible"
                        >
                            {/* Background Image with stronger overlay for readability */}
                            <div className="project-bg absolute inset-0 w-full h-full">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover grayscale brightness-[0.4]"
                                    priority={idx === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            </div>

                            {/* Content Over Background */}
                            <div className="project-content relative h-full w-full flex flex-col justify-end p-8 md:p-20 lg:p-32">
                                <div className="max-w-4xl space-y-6 md:space-y-10">
                                    <div className="space-y-4">
                                        <span className="stagger-item inline-block px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-black tracking-[0.5em] uppercase">
                                            {project.category}
                                        </span>
                                        <h3 className="stagger-item font-headline text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                                            {project.title}
                                        </h3>
                                    </div>

                                    <p className="stagger-item font-body text-neutral-300 text-lg md:text-xl leading-relaxed uppercase tracking-wide max-w-2xl drop-shadow-md">
                                        {project.description}
                                    </p>

                                    <div className="stagger-item flex flex-wrap gap-8 pt-4">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="text-[10px] md:text-xs text-primary font-black tracking-[0.3em] uppercase drop-shadow-md">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {(project.url || project.href) && (
                                        <div className="stagger-item pt-8">
                                            <a href={project.url || project.href} target="_blank" rel="noopener noreferrer" className="inline-block group relative overflow-hidden bg-primary text-black px-16 py-6 font-bold text-xs tracking-[0.3em] uppercase transition-all hover:bg-white active:scale-95 shadow-[0_0_20px_rgba(174,213,0,0.3)]">
                                                <span className="relative z-10">{project.cta || "VER ESTUDO DE CASO"}</span>
                                            </a>
                                        </div>
                                    )}

                                    {/* Visual Stats overlay - bottom right */}
                                    <div className="stagger-item pt-12 flex gap-12 border-t border-white/20">
                                        <div>
                                            <div className="text-3xl md:text-5xl font-black text-primary leading-none tracking-tighter drop-shadow-md">{project.stat1_val}</div>
                                            <div className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-black mt-2 drop-shadow-md">{project.stat1_label}</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl md:text-5xl font-black text-primary leading-none tracking-tighter drop-shadow-md">{project.stat2_val}</div>
                                            <div className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-black mt-2 drop-shadow-md">{project.stat2_label}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Refined Progress Indicator (Tactical HUD Style) */}
                <div className="progress-indicator absolute bottom-20 left-12 z-[110] flex flex-col items-start gap-4 opacity-0">
                    {/* Top Marker */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-black text-primary tracking-[0.2em]">00_INIT</span>
                        <div className="w-4 h-[1px] bg-primary/30" />
                    </div>

                    {/* Progress Track */}
                    <div className="relative group">
                        <div className="h-48 w-[1px] bg-white/5 relative overflow-hidden">
                            <div
                                id="scroll-progress-bar"
                                className="absolute top-0 left-0 w-full bg-primary origin-top shadow-[0_0_15px_#aed500]"
                                style={{ height: "0%" }}
                            />
                        </div>
                        {/* Interactive scanning line (deco) */}
                        <div className="absolute top-0 -left-1 w-3 h-[1px] bg-primary/50 blur-[1px] animate-pulse" />
                    </div>

                    {/* Bottom Marker & Label */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="w-4 h-[1px] bg-white/20" />
                            <span className="text-[7px] font-black text-white/30 tracking-[0.2em]">100_END</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black tracking-[0.5em] text-white/60 uppercase vertical-text py-2 border-l border-primary/20 pl-3">
                                SCROLL TO <span className="text-primary">QUANTUM</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </section >
    );
}
