"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
}

export default function ProjectsSection({ t }: { t: any }) {
    const [activeCategory, setActiveCategory] = useState("ALL");

    // Safeguard
    if (!t.CaseStudies) return <div className="py-20 text-center text-white/20 uppercase tracking-widest">[ ENGINE OFFLINE / DATA ERROR ]</div>;

    const allProjects: Project[] = [
        // TECH Projects (4)
        {
            id: "tech1", category: "TECH", index: "01",
            title: t.CaseStudies.case1?.title || "AYU PILATES",
            description: t.CaseStudies.case1?.description || "",
            stat1_val: "400%", stat1_label: t.CaseStudies.case1?.stat1_label || "GROWTH",
            stat2_val: "60%", stat2_label: t.CaseStudies.case1?.stat2_label || "OPEX",
            image: "/jobs/1.png",
            tags: ["PERFORMANCE", "UI/UX", "SYSTEM"]
        },
        {
            id: "tech2", category: "TECH", index: "02",
            title: t.CaseStudies.case2?.title || "NEXUS GLOBAL",
            description: t.CaseStudies.case2?.description || "",
            stat1_val: "22X", stat1_label: t.CaseStudies.case2?.stat1_label || "ROAS",
            stat2_val: "1.2M", stat2_label: t.CaseStudies.case2?.stat2_label || "USERS",
            image: "/jobs/2.png",
            tags: ["SEO", "ADS", "INFRA"]
        },
        {
            id: "tech3", category: "TECH", index: "03",
            title: t.CaseStudies.case3?.title || "QUANTUM CORE",
            description: t.CaseStudies.case3?.description || "",
            stat1_val: "99.99%", stat1_label: t.CaseStudies.case3?.stat1_label || "UPTIME",
            stat2_val: "2ms", stat2_label: t.CaseStudies.case3?.stat2_label || "LATENCY",
            image: "/jobs/3.png",
            tags: ["BACKEND", "SECURITY", "FINTECH"]
        },
        {
            id: "tech4", category: "TECH", index: "04",
            title: t.CaseStudies.case4?.title || "NEURAL ENGINE",
            description: t.CaseStudies.case4?.description || "",
            stat1_val: "15X", stat1_label: t.CaseStudies.case4?.stat1_label || "SPEED",
            stat2_val: "32TB", stat2_label: t.CaseStudies.case4?.stat2_label || "DATA",
            image: "/jobs/4.png",
            tags: ["AI", "ML", "AUTOMATION"]
        },
        // DESIGN Projects (4)
        {
            id: "design1", category: "DESIGN", index: "05",
            title: t.CaseStudies.case5?.title || "LUX ARCANA",
            description: t.CaseStudies.case5?.description || "",
            stat1_val: "88%", stat1_label: t.CaseStudies.case5?.stat1_label || "REACH",
            stat2_val: "3.5X", stat2_label: t.CaseStudies.case5?.stat2_label || "AOV",
            image: "/jobs/5.png",
            tags: ["BRUTALISM", "FASHION", "UX"]
        },
        {
            id: "design2", category: "DESIGN", index: "06",
            title: t.CaseStudies.case6?.title || "KINETIC BRAND",
            description: t.CaseStudies.case6?.description || "",
            stat1_val: "1.2M", stat1_label: t.CaseStudies.case6?.stat1_label || "REACH",
            stat2_val: "450%", stat2_label: t.CaseStudies.case6?.stat2_label || "RATING",
            image: "/jobs/6.png",
            tags: ["IDENTITY", "MOTION", "VISUAL"]
        },
        {
            id: "design3", category: "DESIGN", index: "07",
            title: t.CaseStudies.case7?.title || "CRYPTO CANVAS",
            description: t.CaseStudies.case7?.description || "",
            stat1_val: "20ms", stat1_label: t.CaseStudies.case7?.stat1_label || "SYNC",
            stat2_val: "0.01", stat2_label: t.CaseStudies.case7?.stat2_label || "FRICTION",
            image: "/jobs/7.png",
            tags: ["CRYPTO", "WEB3", "MINIMALISM"]
        },
        {
            id: "design4", category: "DESIGN", index: "08",
            title: t.CaseStudies.case8?.title || "OASIS INTERFACE",
            description: t.CaseStudies.case8?.description || "",
            stat1_val: "32%", stat1_label: t.CaseStudies.case8?.stat1_label || "RETENTION",
            stat2_val: "4.8", stat2_label: t.CaseStudies.case8?.stat2_label || "RATING",
            image: "/jobs/8.png",
            tags: ["BIOPHILIC", "WORKSPACE", "APPS"]
        }
    ];

    const techCount = allProjects.filter(p => p.category === "TECH").length;
    const designCount = allProjects.filter(p => p.category === "DESIGN").length;
    const totalCount = allProjects.length;

    const filteredProjects = activeCategory === "ALL"
        ? allProjects
        : allProjects.filter(p => p.category === activeCategory);

    const filterOptions = [
        { label: "ALL", count: totalCount },
        { label: "TECH", count: techCount },
        { label: "DESIGN", count: designCount },
    ];

    return (
        <section id="projects" className="py-24 bg-[#141414] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-8">

                {/* Technical Index Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 mb-12 md:mb-24">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">{t.CaseStudies?.label || "PROJETOS SELECIONADOS"}</span>
                        </div>
                        <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight uppercase text-white"
                            dangerouslySetInnerHTML={{ __html: t.CaseStudies?.headline || "ESTUDOS DE CASO" }} />
                    </div>

                    <nav className="flex flex-wrap gap-x-6 md:gap-x-10 gap-y-4 font-label text-[10px] tracking-[0.25em] text-neutral-600">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => setActiveCategory(opt.label)}
                                className={`group flex items-center gap-4 transition-all hover:text-white ${activeCategory === opt.label ? "text-white" : ""}`}
                            >
                                <span className={`transition-colors ${activeCategory === opt.label ? "text-primary" : "text-neutral-800"}`}>
                                    [{opt.count < 10 ? `0${opt.count}` : opt.count}]
                                </span>
                                <span className="uppercase">{opt.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Technical Expanding Archives Grid */}
                <div className="flex flex-col border-t border-white/5">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <ProjectItem key={project.id} project={project} t={t} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

function ProjectItem({ project, t }: { project: Project, t: any }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative border-b border-white/5 overflow-hidden transition-colors duration-500 hover:bg-white/[0.02]"
        >
            {/* Minimal State (Row) */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 md:py-10 px-4 md:px-0 transition-all duration-500 gap-4 md:gap-0 cursor-pointer">
                <div className="flex items-center gap-4 md:gap-16">
                    <span className="font-headline text-xl md:text-2xl font-black text-white/5 group-hover:text-primary/40 transition-colors duration-500">
                        {project.index}
                    </span>
                    <h3 className="font-headline text-2xl md:text-5xl font-bold uppercase tracking-tighter text-white group-hover:translate-x-4 transition-transform duration-700 ease-out">
                        {project.title}
                    </h3>
                </div>

                <div className="flex items-center gap-10">
                    <div className="hidden md:flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="font-label text-[10px] tracking-[0.2em] text-primary">{project.category}</span>
                        <span className="font-label text-[10px] tracking-[0.2em] text-neutral-500 uppercase">{project.tags[0]}</span>
                    </div>
                    <div className="hidden lg:flex w-12 h-12 border border-white/10 items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-500">
                        <span className="material-symbols-outlined text-sm rotate-[-45deg] group-hover:rotate-0 transition-transform duration-500">arrow_forward</span>
                    </div>
                </div>
            </div>

            {/* Expanded Content (Accordion) */}
            <motion.div
                initial={false}
                animate={{
                    height: isHovered ? "auto" : 0,
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 pb-12 md:pb-20 pt-4 px-4 md:px-12">
                    {/* Visual Portal */}
                    <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 bg-neutral-900 border border-white/5">
                        <motion.img
                            animate={{ scale: isHovered ? 1 : 1.15 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                        {/* Floating Stats on Image - Adjusted for mobile breath */}
                        <div className="md:absolute bottom-8 right-8 flex gap-2 md:gap-8 flex-row justify-end p-4 md:p-0">
                            <div className="bg-black/90 backdrop-blur-md p-2 md:p-4 border border-white/10 flex-1 md:flex-initial md:min-w-[120px] shadow-2xl">
                                <div className="text-sm md:text-xl font-bold text-primary">{project.stat1_val}</div>
                                <div className="text-[8px] md:text-[9px] text-neutral-400 uppercase tracking-widest">{project.stat1_label}</div>
                            </div>
                            <div className="bg-black/90 backdrop-blur-md p-2 md:p-4 border border-white/10 flex-1 md:flex-initial md:min-w-[120px] shadow-2xl">
                                <div className="text-sm md:text-xl font-bold text-primary">{project.stat2_val}</div>
                                <div className="text-[8px] md:text-[9px] text-neutral-400 uppercase tracking-widest">{project.stat2_label}</div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Recap */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <div className="inline-block px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
                                PROJECT SPECIFICATIONS
                            </div>
                            <p className="font-body text-neutral-400 text-lg md:text-xl leading-relaxed uppercase tracking-tight">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {project.tags.map((tag: string) => (
                                <span key={tag} className="text-[10px] text-neutral-600 font-black tracking-[0.2em] uppercase border-b border-white/10 pb-1">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <button className="flex items-center gap-4 group/btn w-fit pt-8 translate-y-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards delay-300">
                            <div className="relative overflow-hidden bg-white text-black px-10 py-5 font-bold text-[10px] tracking-widest uppercase transition-all group-hover/btn:bg-primary group-hover/btn:px-12">
                                <span className="relative z-10">{t.CaseStudies.case1?.cta || "VIEW CASE STUDY"}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
