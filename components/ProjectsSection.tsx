"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
    cta?: string;
}

export default function ProjectsSection({ t }: { t: any }) {
    const [activeCategory, setActiveCategory] = useState("ALL");
    const containerRef = useRef<HTMLDivElement>(null);

    // Dynamic counts from translation data
    const allProjects: Project[] = useMemo(() => [
        {
            id: "tech1", category: "TECH", index: "01",
            title: t.CaseStudies.case1?.title || "AYU PILATES",
            description: t.CaseStudies.case1?.description,
            stat1_val: "400%", stat1_label: t.CaseStudies.case1?.stat1_label,
            stat2_val: "60%", stat2_label: t.CaseStudies.case1?.stat2_label,
            image: "/jobs/1.png",
            tags: ["PERFORMANCE", "UI/UX", "SYSTEM"],
            cta: t.CaseStudies.case1?.cta
        },
        {
            id: "tech2", category: "TECH", index: "02",
            title: t.CaseStudies.case2?.title || "MULTINTERCÂMBIO",
            description: t.CaseStudies.case2?.description,
            stat1_val: "22X", stat1_label: t.CaseStudies.case2?.stat1_label,
            stat2_val: "1.2M", stat2_label: t.CaseStudies.case2?.stat2_label,
            image: "/jobs/2.png",
            tags: ["SEO", "ADS", "INFRA"],
            cta: t.CaseStudies.case2?.cta
        },
        {
            id: "tech3", category: "TECH", index: "03",
            title: t.CaseStudies.case3?.title || "MULTINTERCÂMBIO CMS",
            description: t.CaseStudies.case3?.description,
            stat1_val: "99.99%", stat1_label: t.CaseStudies.case3?.stat1_label,
            stat2_val: "2ms", stat2_label: t.CaseStudies.case3?.stat2_label,
            image: "/jobs/3.png",
            tags: ["BACKEND", "SECURITY", "FINTECH"],
            cta: t.CaseStudies.case3?.cta
        },
        {
            id: "tech4", category: "TECH", index: "04",
            title: t.CaseStudies.case4?.title || "CORREZERO13 LP",
            description: t.CaseStudies.case4?.description,
            stat1_val: "15X", stat1_label: t.CaseStudies.case4?.stat1_label,
            stat2_val: "32TB", stat2_label: t.CaseStudies.case4?.stat2_label,
            image: "/jobs/4.png",
            tags: ["AI", "ML", "AUTOMATION"],
            cta: t.CaseStudies.case4?.cta
        },
        {
            id: "design1", category: "DESIGN", index: "05",
            title: t.CaseStudies.case5?.title || "CORREZERO13 PLATFORM",
            description: t.CaseStudies.case5?.description,
            stat1_val: "88%", stat1_label: t.CaseStudies.case5?.stat1_label,
            stat2_val: "3.5X", stat2_label: t.CaseStudies.case5?.stat2_label,
            image: "/jobs/5.png",
            tags: ["BRUTALISM", "FASHION", "UX"],
            cta: t.CaseStudies.case5?.cta
        },
        {
            id: "design2", category: "DESIGN", index: "06",
            title: t.CaseStudies.case6?.title || "CAMPEDELLI",
            description: t.CaseStudies.case6?.description,
            stat1_val: "1.2M", stat1_label: t.CaseStudies.case6?.stat1_label,
            stat2_val: "450%", stat2_label: t.CaseStudies.case6?.stat2_label,
            image: "/jobs/6.png",
            tags: ["IDENTITY", "MOTION", "VISUAL"],
            cta: t.CaseStudies.case6?.cta
        },
        {
            id: "design3", category: "DESIGN", index: "07",
            title: t.CaseStudies.case7?.title || "GOSAFE",
            description: t.CaseStudies.case7?.description,
            stat1_val: "20ms", stat1_label: t.CaseStudies.case7?.stat1_label,
            stat2_val: "0.01", stat2_label: t.CaseStudies.case7?.stat2_label,
            image: "/jobs/7.png",
            tags: ["CRYPTO", "WEB3", "MINIMALISM"],
            cta: t.CaseStudies.case7?.cta
        },
        {
            id: "design4", category: "DESIGN", index: "08",
            title: t.CaseStudies.case8?.title || "LALABABY",
            description: t.CaseStudies.case8?.description,
            stat1_val: "32%", stat1_label: t.CaseStudies.case8?.stat1_label,
            stat2_val: "4.8", stat2_label: t.CaseStudies.case8?.stat2_label,
            image: "/jobs/8.png",
            tags: ["BIOPHILIC", "WORKSPACE", "APPS"],
            cta: t.CaseStudies.case8?.cta
        }
    ], [t]);

    const filteredProjects = activeCategory === "ALL"
        ? allProjects
        : allProjects.filter(p => p.category === activeCategory);

    const filterOptions = [
        { label: "ALL", count: allProjects.length },
        { label: "TECH", count: allProjects.filter(p => p.category === "TECH").length },
        { label: "DESIGN", count: allProjects.filter(p => p.category === "DESIGN").length },
    ];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth scroll configuration
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Horizontal translation based on SMOOTH progress
    const x = useTransform(smoothProgress, [0, 1], ["0%", `-${(filteredProjects.length - 1) * 100}%`]);

    // Title Fade: persistent zero opacity using smooth scroll
    const titleOpacity = useTransform(smoothProgress, [0, 0.05, 1], [1, 0, 0]);
    const titleY = useTransform(smoothProgress, [0, 0.05, 1], [0, -40, -40]);

    const pageIndex = useTransform(smoothProgress,
        filteredProjects.map((_, i) => i / (filteredProjects.length - 1)),
        filteredProjects.map((_, i) => i)
    );

    const [currentPage, setCurrentPage] = useState(0);

    useTransform(pageIndex, (latest) => {
        const rounded = Math.round(latest);
        if (rounded !== currentPage) setCurrentPage(rounded);
        return latest;
    });

    return (
        <section ref={containerRef} id="projects" className="relative bg-[#141414] overflow-visible">
            {/* Desktop View */}
            <div className="hidden md:block" style={{ height: `${filteredProjects.length * 100}vh` }}>
                <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">

                    {/* Fixed Header */}
                    <div className="absolute top-0 left-0 w-full px-12 pt-24 z-[100] flex justify-between items-start pointer-events-none">
                        <div className="max-w-2xl pointer-events-auto">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">{t.CaseStudies?.label || "PROJETOS SELECIONADOS"}</span>
                            </div>

                            <motion.div style={{ opacity: titleOpacity, y: titleY }}>
                                <h2 className="font-headline text-4xl lg:text-7xl font-bold tracking-tight uppercase text-white leading-[0.9]"
                                    dangerouslySetInnerHTML={{ __html: t.CaseStudies?.headline || "ESTUDOS DE CASO" }} />
                            </motion.div>
                        </div>

                        <nav className="flex gap-x-12 font-label text-[11px] tracking-[0.25em] text-neutral-600 pointer-events-auto pt-14">
                            {filterOptions.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setActiveCategory(opt.label)}
                                    className={`group flex items-center gap-4 transition-all hover:text-white ${activeCategory === opt.label ? "text-white" : ""}`}
                                >
                                    <span className={`transition-colors font-black ${activeCategory === opt.label ? "text-primary" : "text-neutral-800"}`}>
                                        [{opt.count < 10 ? `0${opt.count}` : opt.count}]
                                    </span>
                                    <span className="uppercase font-black">{opt.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Sliding Slides Container (Reduced top gap) */}
                    <motion.div style={{ x }} className="flex h-full w-full relative z-10 transition-transform duration-75">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="min-w-full h-full flex items-center justify-center p-12 lg:p-24 pt-[10vh] pb-[10vh]">
                                <ProjectSlide project={project} />
                            </div>
                        ))}
                    </motion.div>

                    {/* Horizontal Pagination Indicator Footer */}
                    <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12 z-50 flex justify-center bg-gradient-to-t from-black/80 to-transparent">

                        <div className="flex items-center gap-x-16 lg:gap-x-32">
                            {/* Left part: Progress indicator */}
                            <div className="flex flex-col gap-3">
                                <span className="text-[9px] font-black tracking-[0.5em] text-white/40 uppercase">NAVIGATE PROJECTS</span>
                                <div className="w-48 lg:w-80 h-[2px] bg-white/5 relative overflow-hidden">
                                    <motion.div
                                        style={{ scaleX: smoothProgress }}
                                        className="absolute inset-0 bg-primary origin-left shadow-[0_0_15px_#00ff00]"
                                    />
                                </div>
                            </div>

                            {/* Right part: Horizontal Numbering */}
                            <div className="flex items-end gap-x-6">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-headline text-5xl lg:text-7xl font-black text-white leading-none">
                                        {(currentPage + 1).toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-xl lg:text-2xl text-white/20 font-black">/</span>
                                    <span className="text-xl lg:text-2xl text-white/40 font-black">
                                        {filteredProjects.length.toString().padStart(2, "0")}
                                    </span>
                                </div>
                                <span className="text-[9px] font-black tracking-[0.4em] text-primary uppercase mb-2 opacity-60 hidden lg:block">SELECTION ARCHIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden py-16 px-6">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 mb-6">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase">{t.CaseStudies?.label || "PROJETOS SELECIONADOS"}</span>
                    </div>
                    <h2 className="font-headline text-3xl font-bold tracking-tight uppercase text-white mb-6"
                        dangerouslySetInnerHTML={{ __html: t.CaseStudies?.headline || "ESTUDOS DE CASO" }} />
                    <nav className="flex gap-4 overflow-x-auto no-scrollbar">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => setActiveCategory(opt.label)}
                                className={`text-[10px] font-black tracking-widest uppercase pb-2 border-b-2 transition-all ${activeCategory === opt.label ? "border-primary text-white" : "border-transparent text-neutral-600"}`}
                            >
                                [{opt.count < 10 ? `0${opt.count}` : opt.count}] {opt.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="space-y-12">
                    {filteredProjects.map((project) => (
                        <ProjectSlide key={project.id} project={project} isMobile={true} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProjectSlide({ project, isMobile = false }: { project: Project; isMobile?: boolean }) {
    return (
        <div className={`flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full max-w-[1600px] ${isMobile ? "" : "h-full"}`}>
            {/* Image Section */}
            <div className="lg:col-span-7 w-full h-[60vh] lg:h-full lg:max-h-[60vh] relative group overflow-hidden border border-white/5">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.01] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />

                {/* Visual Stats overlay */}
                <div className="absolute bottom-8 left-8 flex gap-12">
                    <div>
                        <div className="text-xl lg:text-3xl font-black text-primary leading-none tracking-tighter">{project.stat1_val}</div>
                        <div className="text-[9px] text-white/50 uppercase tracking-[0.3em] font-black mt-2">{project.stat1_label}</div>
                    </div>
                    <div>
                        <div className="text-xl lg:text-3xl font-black text-primary leading-none tracking-tighter">{project.stat2_val}</div>
                        <div className="text-[9px] text-white/50 uppercase tracking-[0.3em] font-black mt-2">{project.stat2_label}</div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:space-y-10">
                <div className="space-y-2 lg:space-y-4">
                    <span className="text-primary text-[10px] lg:text-[12px] font-black tracking-[0.5em] uppercase">[{project.category}]</span>
                    <h3 className="font-headline text-4xl lg:text-7xl font-bold uppercase tracking-tighter text-white leading-[0.9]">
                        {project.title}
                    </h3>
                </div>

                <p className="font-body text-neutral-400 text-base lg:text-xl leading-relaxed uppercase tracking-tight max-w-xl">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
                    {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-primary/60 font-black tracking-[0.3em] uppercase">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="pt-8">
                    <button className="group relative overflow-hidden bg-white text-black px-12 py-5 font-bold text-[11px] tracking-[0.3em] uppercase transition-all hover:bg-primary">
                        <span className="relative z-10">{project.cta || "VIEW CASE STUDY"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
