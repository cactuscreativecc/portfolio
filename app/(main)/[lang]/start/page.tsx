import React from "react";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StartChat from "@/components/StartChat";
import { Waves } from "@/components/ui/wave-background";

export default async function StartPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const t: any = await getDictionary(lang as Locale);

    return (
        <div className="bg-background text-on-surface selection:bg-primary selection:text-on-primary min-h-screen flex flex-col relative overflow-hidden">
            <Navbar t={t} lang={lang as Locale} />

            <main className="flex-1 flex flex-col justify-center relative z-10 pt-32 pb-24 px-6 md:px-16 max-w-grid mx-auto w-full">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">{lang === 'en' ? "PHASE 01" : "FASE 01"}</span>
                    </div>
                    <h1 className="font-headline text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                        {lang === 'en' ? "START" : "INICIAR"} <span className="text-primary">{lang === 'en' ? "PROJECT" : "PROJETO"}</span>
                    </h1>
                </div>

                <StartChat lang={lang} />
            </main>

            {/* Background with Waves component */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <Waves />
            </div>

            <div className="relative z-10">
                <Footer t={t} />
            </div>
        </div>
    );
}
