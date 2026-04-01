"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Safeguard
    if (!t.CaseStudies) return <div className="py-20 text-center text-white/20 uppercase tracking-widest">[ ENGINE OFFLINE / DATA ERROR ]</div>;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const allProjects: Project[] = [
        // TECH Projects (4)
        {
            id: "tech1", category: "TECH", index: "01",
            title: t.CaseStudies.case1?.title || "AETHERA SYSTEMS",
            description: "High-performance digital system scaling revenue by 400%.",
            stat1_val: "400%", stat1_label: "GROWTH", stat2_val: "60%", stat2_label: "OPEX",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPSx6QeeDcCvWp49Mun64Ts-PVWyBbT1n3HG0C_jMrm4lqeq6YhBDg5dFjXU_PcT4o2G2yoYOhTh7TOChsAjS42WvcpVSTHDdKQnP8-3eBItPTBfQ9Omcn7K1ceG9lldGATt2Ysop67a94AnsCk3SwnsxcbW4jJgKMZAPJAPboHwViKbbH7ZrD7gSmVT5YhU_1kyHlmQodNfLePCypZwQQxlY2gDQ31GSG7gfNu5PrBLazA58t5V7DWILkv7Ok4EehwCBJXl46tf0",
            tags: ["PERFORMANCE", "ARCHITECTURE", "SYSTEM"]
        },
        {
            id: "tech2", category: "TECH", index: "02",
            title: "QUANTUM CORE",
            description: "Distributed infrastructure for high-traffic financial clusters.",
            stat1_val: "99.99%", stat1_label: "UPTIME", stat2_val: "2ms", stat2_label: "LATENCY",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP0Sre2C2U7v-FpYjZ7U-J_mD6-P-_V-m9-T9-X-G-H-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-X-Y-Z",
            tags: ["INFRA", "BACKEND", "SECURITY"]
        },
        {
            id: "tech3", category: "TECH", index: "03",
            title: "NEURAL ENGINE",
            description: "Proprietary AI integration for predictive market analysis.",
            stat1_val: "15X", stat1_label: "SPEED", stat2_val: "32TB", stat2_label: "DATA",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPSx6QeeDcCvWp49Mun64Ts-PVWyBbT1n3HG0C_jMrm4lqeq6YhBDg5dFjXU_PcT4o2G2yoYOhTh7TOChsAjS42WvcpVSTHDdKQnP8-3eBItPTBfQ9Omcn7K1ceG9lldGATt2Ysop67a94AnsCk3SwnsxcbW4jJgKMZAPJAPboHwViKbbH7ZrD7gSmVT5YhU_1kyHlmQodNfLePCypZwQQxlY2gDQ31GSG7gfNu5PrBLazA58t5V7DWILkv7Ok4EehwCBJXl46tf0",
            tags: ["AI", "ML", "AUTOMATION"]
        },
        {
            id: "tech4", category: "TECH", index: "04",
            title: "VELOCITY STACK",
            description: "Edge computing layer for real-time betting platforms.",
            stat1_val: "10ms", stat1_label: "RESPONSE", stat2_val: "100%", stat2_label: "ACCURACY",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP0Sre2C2U7v-FpYjZ7U-J_mD6-P-_V-m9-T9-X-G-H-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-X-Y-Z",
            tags: ["EDGE", "RUST", "SYNC"]
        },
        // DESIGN Projects (4)
        {
            id: "design1", category: "DESIGN", index: "05",
            title: "LUX ARCANA",
            description: "Premium brutalist UI for a European high-fashion curator.",
            stat1_val: "88%", stat1_label: "ENGAGEMENT", stat2_val: "3.5X", stat2_label: "AOV",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP0Sre2C2U7v-FpYjZ7U-J_mD6-P-_V-m9-T9-X-G-H-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-X-Y-Z",
            tags: ["BRUTALISM", "UX", "E-COMMERCE"]
        },
        {
            id: "design2", category: "DESIGN", index: "06",
            title: "KINETIC BRAND",
            description: "Motion-first identity for a global tech conglomerate.",
            stat1_val: "1.2M", stat1_label: "REACH", stat2_val: "450%", stat2_label: "RECOGNITION",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPSx6QeeDcCvWp49Mun64Ts-PVWyBbT1n3HG0C_jMrm4lqeq6YhBDg5dFjXU_PcT4o2G2yoYOhTh7TOChsAjS42WvcpVSTHDdKQnP8-3eBItPTBfQ9Omcn7K1ceG9lldGATt2Ysop67a94AnsCk3SwnsxcbW4jJgKMZAPJAPboHwViKbbH7ZrD7gSmVT5YhU_1kyHlmQodNfLePCypZwQQxlY2gDQ31GSG7gfNu5PrBLazA58t5V7DWILkv7Ok4EehwCBJXl46tf0",
            tags: ["IDENTITY", "MOTION", "VISUAL"]
        },
        {
            id: "design3", category: "DESIGN", index: "07",
            title: "CRYPTO CANVAS",
            description: "Hyper-minimalist dashboard for specialized asset management.",
            stat1_val: "20ms", stat1_label: "SYNC", stat2_val: "0.01", stat2_label: "FRICTION",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP0Sre2C2U7v-FpYjZ7U-J_mD6-P-_V-m9-T9-X-G-H-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-X-Y-Z",
            tags: ["DASHBOARD", "CRYPTO", "MINIMALISM"]
        },
        {
            id: "design4", category: "DESIGN", index: "08",
            title: "OASIS INTERFACE",
            description: "Biophilic design framework for high-end workspace apps.",
            stat1_val: "32%", stat1_label: "RETENTION", stat2_val: "4.8", stat2_label: "RATING",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPSx6QeeDcCvWp49Mun64Ts-PVWyBbT1n3HG0C_jMrm4lqeq6YhBDg5dFjXU_PcT4o2G2yoYOhTh7TOChsAjS42WvcpVSTHDdKQnP8-3eBItPTBfQ9Omcn7K1ceG9lldGATt2Ysop67a94AnsCk3SwnsxcbW4jJgKMZAPJAPboHwViKbbH7ZrD7gSmVT5YhU_1kyHlmQodNfLePCypZwQQxlY2gDQ31GSG7gfNu5PrBLazA58t5V7DWILkv7Ok4EehwCBJXl46tf0",
            tags: ["BIOPHILIC", "SYSTEMS", "APPS"]
        }
    ];

    // Dynamic Logic for Filters
    const techCount = allProjects.filter(p => p.category === "TECH").length;
    const designCount = allProjects.filter(p => p.category === "DESIGN").length;
    const totalCount = allProjects.length;

    const filteredProjects = activeCategory === "ALL"
        ? allProjects
        : allProjects.filter(p => p.category === activeCategory);

    useEffect(() => {
        setCurrentIndex(0);
    }, [activeCategory]);

    const nextProject = () => {
        setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    };

    const prevProject = () => {
        setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    };

    const currentProject = filteredProjects[currentIndex] || allProjects[0];

    const getDisplayIndex = () => {
        const index = currentIndex + 1;
        const total = filteredProjects.length;
        return `[0${index}] / [0${total}]`;
    };

    const filterOptions = [
        { label: "ALL", count: totalCount },
        { label: "TECH", count: techCount },
        { label: "DESIGN", count: designCount },
    ];

    return (
        <section id="projects" className="py-24 bg-[#141414] relative overflow-hidden transition-colors duration-700">
            <div className="max-w-7xl mx-auto px-6 md:px-8">

                {/* Technical Index Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 mb-12 md:mb-24">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 mb-8">
                            <div className="w-2 h-2 bg-primary animate-pulse" />
                            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant leading-none">{t.CaseStudies?.label || "PROJETOS SELECIONADOS"}</span>
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

                <div className="relative min-h-0 lg:min-h-[700px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentProject.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(e, info) => {
                                if (info.offset.x > 100) prevProject();
                                else if (info.offset.x < -100) nextProject();
                            }}
                        >
                            <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
                                <div className="space-y-4">
                                    <div className="text-primary font-bold tracking-widest text-[10px]">
                                        {getDisplayIndex()} PROJECT / {currentProject.category}
                                    </div>
                                    <h3 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-tighter text-white">
                                        {currentProject.title}
                                    </h3>
                                    <p className="font-body text-neutral-400 leading-relaxed">
                                        {currentProject.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-10">
                                    <div>
                                        <div className="text-2xl font-bold text-white mb-1">{currentProject.stat1_val}</div>
                                        <div className="text-[10px] text-primary uppercase tracking-widest leading-tight">{currentProject.stat1_label}</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white mb-1">{currentProject.stat2_val}</div>
                                        <div className="text-[10px] text-primary uppercase tracking-widest leading-tight">{currentProject.stat2_label}</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {currentProject.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] text-neutral-400 font-bold tracking-tighter uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="flex items-center gap-4 group mt-4">
                                    <span className="w-12 h-12 bg-primary text-black flex items-center justify-center hover:bg-white transition-all duration-500">
                                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                    </span>
                                    <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-primary group-hover:text-white transition-colors">
                                        {t.CaseStudies.case1?.cta || "EXPLORAR"}
                                    </span>
                                </button>
                            </div>

                            <div
                                className="lg:col-span-8 order-1 lg:order-2 cursor-none relative group/container"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                {/* Side Navigation Overlay Buttons */}
                                <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center z-40 opacity-0 group-hover/container:opacity-100 transition-opacity">
                                    <button
                                        onClick={prevProject}
                                        className="w-12 h-12 rounded-full border border-primary text-primary bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-primary hover:text-black transition-all pointer-events-auto"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                </div>
                                <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center z-40 opacity-0 group-hover/container:opacity-100 transition-opacity">
                                    <button
                                        onClick={nextProject}
                                        className="w-12 h-12 rounded-full border border-primary text-primary bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-primary hover:text-black transition-all pointer-events-auto"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>

                                <div className="bg-neutral-900 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden group relative">
                                    <div className="h-10 border-b border-white/5 bg-[#1a1a1a] flex items-center px-4 justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="bg-black/20 px-6 py-1 rounded text-[8px] text-neutral-600 font-mono tracking-tight lowercase">
                                            studiocactus.com/work/projects
                                        </div>
                                    </div>
                                    <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <img
                                            src={currentProject.image}
                                            alt={currentProject.title}
                                            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 pointer-events-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Custom Floating Cursor (Pill Only) */}
                    <motion.div
                        className="fixed pointer-events-none z-[100] hidden lg:block"
                        animate={{
                            x: mousePos.x - 35,
                            y: mousePos.y - 15,
                            opacity: isHovering ? 1 : 0,
                            scale: isHovering ? 1 : 0.5
                        }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.5 }}
                    >
                        <div className="px-5 py-2 bg-primary rounded-full text-black font-headline text-[8px] font-black tracking-[0.2em] uppercase shadow-[0_10px_30px_rgba(174,213,0,0.3)] border border-primary/50">
                            DRAG
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
