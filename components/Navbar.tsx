"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DictionarySwitcher from "./DictionarySwitcher";
import { Locale } from "@/i18n-config";

interface NavbarProps {
    t: any;
    lang: Locale;
}

export default function Navbar({ t, lang }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: t.Navigation.services, href: "#services" },
        { name: t.Navigation.work, href: "#work" },
        { name: t.Navigation.tech, href: "#tech" },
        { name: t.Navigation.about, href: "#about" },
        { name: t.Navigation.contact, href: "#contact" },
    ];

    const menuVariants: any = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    const linkVariants: any = {
        closed: { opacity: 0, y: 20 },
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3 + i * 0.1,
                duration: 0.5,
                ease: "easeOut",
            },
        }),
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? "py-4 bg-background/90 backdrop-blur-xl" : "py-8 bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                    {/* Logo */}
                    <a href="#home" className="text-xl md:text-2xl font-black tracking-tighter text-white group">
                        CACTUS<span className="text-primary group-hover:text-white transition-colors">CREATIVE</span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="font-label text-[10px] font-bold tracking-[0.3em] text-neutral-400 hover:text-primary uppercase transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Right Side Tools */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            href={`/${lang}/portal`}
                            className="font-label text-[10px] font-bold tracking-[0.3em] text-neutral-400 hover:text-white uppercase transition-colors"
                        >
                            {t.Navigation.portal}
                        </Link>
                        <DictionarySwitcher currentLocale={lang} />
                        <a
                            href="#contact"
                            className="bg-primary text-black px-6 py-4 font-black text-[10px] tracking-widest uppercase hover:bg-white transition-all duration-300"
                        >
                            {t.Navigation.start_project}
                        </a>
                    </div>

                    {/* Mobile Hamburger (Target: 430px) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                    >
                        <motion.div
                            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : 0 }}
                            className="w-6 h-0.5 bg-white"
                        />
                        <motion.div
                            animate={{ opacity: isOpen ? 0 : 1 }}
                            className="w-6 h-0.5 bg-white"
                        />
                        <motion.div
                            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -4 : 0 }}
                            className="w-6 h-0.5 bg-white"
                        />
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 bg-background z-[105] flex flex-col px-8 pt-24 pb-12 lg:hidden overflow-y-auto"
                    >
                        {/* Background Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden select-none">
                            <span className="text-[30vw] font-black font-headline rotate-90">MENU</span>
                        </div>

                        <nav className="flex flex-col gap-6 relative z-10">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    custom={i}
                                    variants={linkVariants}
                                    onClick={() => setIsOpen(false)}
                                    className="font-headline text-4xl font-black uppercase text-white hover:text-primary transition-colors tracking-tighter"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </nav>

                        <div className="mt-12 space-y-4 relative z-10 pb-8">
                            {/* Mobile CTA */}
                            <motion.div
                                variants={linkVariants}
                                custom={navLinks.length}
                            >
                                <Link
                                    href={`/${lang}/portal`}
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full border border-white/20 text-white py-6 text-center font-black text-xs tracking-[0.4em] uppercase hover:bg-white/5"
                                >
                                    {t.Navigation.portal}
                                </Link>
                            </motion.div>

                            <motion.div
                                variants={linkVariants}
                                custom={navLinks.length + 1}
                            >
                                <a
                                    href="#contact"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-primary text-black py-8 text-center font-black text-xs tracking-[0.4em] uppercase"
                                >
                                    {t.Navigation.start_project}
                                </a>
                            </motion.div>

                            {/* Mobile Language & Meta */}
                            <motion.div
                                variants={linkVariants}
                                custom={navLinks.length + 2}
                                className="flex justify-between items-center pt-8 border-t border-white/5"
                            >
                                <DictionarySwitcher currentLocale={lang} />
                                <div className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                                    © 2026 CactusCreative
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
