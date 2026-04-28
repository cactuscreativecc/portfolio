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

            <main className="flex-1 flex flex-col relative z-10 pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center mb-4">
                    <h1 className="font-headline text-3xl md:text-5xl font-black uppercase text-white tracking-tighter">
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
