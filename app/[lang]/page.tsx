import React from "react";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import InteractiveSpotlight from "@/components/InteractiveSpotlight";
import StatsSection from "@/components/StatsSection";
import FlipWord from "@/components/FlipWord";
import ClientMarquee from "@/components/ClientMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import SuccessStories from "@/components/SuccessStories";
import InteractiveWaves from "@/components/InteractiveWaves";
import DictionarySwitcher from "@/components/DictionarySwitcher";
import ScrollToTop from "@/components/ScrollToTop";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t: any = await getDictionary(lang as Locale);

  return (
    <div className="bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5 h-20">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-white">STUDIOCACTUS</div>
          <div className="hidden md:flex gap-12 font-label text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
            <a href="#work" className="hover:text-primary transition-colors">{t.Navigation.work}</a>
            <a href="#services" className="hover:text-primary transition-colors">{t.Navigation.services}</a>
            <a href="#tech" className="hover:text-primary transition-colors">{t.Navigation.tech}</a>
            <a href="#about" className="hover:text-primary transition-colors">{t.Navigation.about}</a>
          </div>
          <div className="flex items-center gap-8">
            <DictionarySwitcher currentLocale={lang as Locale} />
            <button className="bg-primary text-black px-6 py-2 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all">
              {t.Navigation.start_project}
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO - Ultra Modern Digital Architecture */}
        <section className="relative min-h-screen pt-32 flex flex-col justify-center overflow-hidden">
          <InteractiveWaves />
          <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/5 bg-white/5 mb-12">
                <div className="w-2 h-2 bg-primary animate-pulse" />
                <span className="font-label text-xs uppercase tracking-[0.25em] text-neutral-400 leading-none">{t.Hero.badge}</span>
              </div>

              {/* Refined Headline with Flip-Box Effect on High-Impact Words */}
              <h1 className="font-headline text-[10vw] md:text-[5vw] font-black leading-[0.95] tracking-tighter uppercase mb-16 text-white overflow-hidden">
                {lang === 'en' ? (
                  <>
                    STOP <span className="text-primary italic"><FlipWord text="EXISTING" /></span>. <br />
                    START <span className="text-primary italic"><FlipWord text="DOMINATING" /></span>.
                  </>
                ) : (
                  <>
                    PARE DE <span className="text-primary italic"><FlipWord text="EXISTIR" /></span>. <br />
                    COMECE A <span className="text-primary italic"><FlipWord text="DOMINAR" /></span>.
                  </>
                )}
              </h1>

              <p className="font-body text-lg md:text-xl text-neutral-500 max-w-2xl leading-relaxed uppercase tracking-tighter">
                {t.Hero.description}
              </p>

              <div className="mt-20 flex gap-4">
                <button className="group relative overflow-hidden bg-white text-black px-12 py-6 font-bold text-base tracking-widest transition-all">
                  <span className="relative z-10 uppercase">{t.Hero.cta_primary}</span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 right-8 flex flex-col items-end gap-2 font-label text-[10px] tracking-[0.5em] text-neutral-700 writing-vertical uppercase">
            <span>scroll [ down ] to dive</span>
          </div>
        </section>

        <ClientMarquee title={t.Hero.trusted_us} />

        <div id="work">
          <ProjectsSection t={t} />
        </div>

        <div id="services">
          {/* Services - Technical Architecture Grid */}
          <section className="py-40 px-6 bg-black border-y border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                <div className="lg:col-span-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 mb-8">
                    <div className="w-2 h-2 bg-primary animate-pulse" />
                    <span className="font-label text-xs uppercase tracking-[0.2em] text-neutral-400 leading-none">{t.Capabilities.label}</span>
                  </div>
                  <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none text-white lg:max-w-3xl mb-12"
                    dangerouslySetInnerHTML={{ __html: t.Capabilities.headline }} />
                </div>

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-white/5 p-[1px]">
                  <div className="bg-background p-10 group hover:bg-primary transition-all duration-700 relative overflow-hidden">
                    <div className="text-4xl font-black text-white/5 group-hover:text-black/10 transition-colors mb-6">01</div>
                    <h3 className="text-xl font-bold text-white group-hover:text-black uppercase mb-4">{t.Capabilities.tech.title}</h3>
                    <p className="text-neutral-500 group-hover:text-black/80 font-body uppercase leading-relaxed text-[11px] tracking-tight">
                      {t.Capabilities.tech.description}
                    </p>
                  </div>
                  <div className="bg-background p-10 group hover:bg-primary transition-all duration-700 relative overflow-hidden">
                    <div className="text-4xl font-black text-white/5 group-hover:text-black/10 transition-colors mb-6">02</div>
                    <h3 className="text-xl font-bold text-white group-hover:text-black uppercase mb-4">{t.Capabilities.ads.title}</h3>
                    <p className="text-neutral-500 group-hover:text-black/80 font-body uppercase leading-relaxed text-[11px] tracking-tight">
                      {t.Capabilities.ads.description}
                    </p>
                  </div>
                  <div className="bg-background p-10 group hover:bg-primary transition-all duration-700 relative overflow-hidden">
                    <div className="text-4xl font-black text-white/5 group-hover:text-black/10 transition-colors mb-6">03</div>
                    <h3 className="text-xl font-bold text-white group-hover:text-black uppercase mb-4">{t.Capabilities.retention.title}</h3>
                    <p className="text-neutral-500 group-hover:text-black/80 font-body uppercase leading-relaxed text-[11px] tracking-tight">
                      {t.Capabilities.retention.description}
                    </p>
                  </div>
                  <div className="bg-background p-10 group hover:bg-primary transition-all duration-700 relative overflow-hidden">
                    <div className="text-4xl font-black text-white/5 group-hover:text-black/10 transition-colors mb-6">04</div>
                    <h3 className="text-xl font-bold text-white group-hover:text-black uppercase mb-4">{t.Capabilities.design.title}</h3>
                    <p className="text-neutral-500 group-hover:text-black/80 font-body uppercase leading-relaxed text-[11px] tracking-tight">
                      {t.Capabilities.design.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <InteractiveSpotlight />

        <StatsSection t={t.Highlights} />

        <SuccessStories t={t} />

        {/* Final CTA Section */}
        <section className="py-40 px-6 bg-primary text-on-primary font-space-grotesk relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-12 uppercase leading-none text-on-primary"
              dangerouslySetInnerHTML={{ __html: t.CTA.headline }} />
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-16">
              <button className="bg-on-primary text-primary px-12 py-6 font-bold text-lg tracking-widest uppercase hover:opacity-90 transition-all">
                {t.CTA.button_start}
              </button>
              <button className="border-2 border-on-primary text-on-primary px-12 py-6 font-bold text-lg tracking-widest uppercase hover:bg-on-primary hover:text-primary transition-all">
                {t.CTA.button_audit}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Premium Editorial Layout */}
      <footer className="relative bg-background pt-32 pb-48 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
            <div className="md:col-span-4 space-y-8">
              <div className="text-3xl font-bold tracking-tighter text-white">STUDIOCACTUS</div>
              <p className="font-body text-neutral-500 leading-relaxed max-w-sm uppercase">
                {t.Footer.description}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                  <span className="material-symbols-outlined text-sm">share</span>
                </a>
                <a href="mailto:contact@studiocactus.com" className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                  <span className="material-symbols-outlined text-sm">mail</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">{t.Footer.menu}</h4>
              <ul className="space-y-4 font-body text-sm text-white">
                <li><a href="#work" className="hover:text-primary transition-colors uppercase">{t.Navigation.work}</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors uppercase">{t.Navigation.services}</a></li>
                <li><a href="#tech" className="hover:text-primary transition-colors uppercase">{t.Navigation.tech}</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors uppercase">{t.Navigation.about}</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">{t.Footer.services}</h4>
              <ul className="space-y-4 font-body text-sm text-white">
                <li><a href="#" className="hover:text-primary transition-colors uppercase">WEB SYSTEMS</a></li>
                <li><a href="#" className="hover:text-primary transition-colors uppercase">PERFORMANCE ADS</a></li>
                <li><a href="#" className="hover:text-primary transition-colors uppercase">CONVERSION UI/UX</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-8">
              <div>
                <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold mb-6">CONTACT</h4>
                <div className="space-y-4 font-headline text-2xl font-bold text-white tracking-tighter">
                  <a href="mailto:contact@studiocactus.com" className="block hover:text-primary transition-colors">contact@studiocactus.com</a>

                  {/* Global Phone Channels */}
                  <div className="space-y-4 pt-4">
                    <a
                      href="https://wa.me/5511999999999?text=Ol%C3%A1%20StudioCactus!%20Gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20engenharia%20digital."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 hover:text-primary transition-all"
                    >
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-primary">[BR]</span>
                      <span>+55 11 99999-9999</span>
                    </a>
                    <a
                      href="https://wa.me/16045555555?text=Hello%20StudioCactus!%20I'd%20like%20to%20know%20more%20about%20your%20digital%20engineering%20solutions."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 hover:text-primary transition-all"
                    >
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-primary">[CA]</span>
                      <span>+1 (604) 555-5555</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Operating Hours Box */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="font-label text-[10px] uppercase tracking-widest text-neutral-600 font-bold">OPERATING HOURS</h4>
                <div className="flex justify-between items-end font-mono text-[10px] text-neutral-400">
                  <div className="space-y-1">
                    <p>MON — FRI</p>
                    <p className="text-white">09:00 — 18:00 [BRT]</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p>SAT — SUN</p>
                    <p className="text-neutral-700 font-bold">OFFLINE</p>
                  </div>
                </div>

                {/* Dynamic Status Engine */}
                <div className="pt-4">
                  {(() => {
                    const now = new Date();
                    const day = now.getDay();
                    const hour = now.getHours();
                    const isWorkingHours = day >= 1 && day <= 5 && hour >= 9 && hour < 18;

                    return (
                      <div className={`inline-flex items-center gap-3 px-4 py-2 border transition-all duration-700 ${isWorkingHours
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-white/5 border-white/10 text-neutral-600 grayscale"
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${isWorkingHours ? "bg-primary animate-pulse" : "bg-neutral-800"
                          }`} />
                        <span className="text-[10px] font-black tracking-[0.25em] uppercase leading-none">
                          {isWorkingHours ? "OPERATIONAL" : "STANDBY MODE"}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 font-label text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
            <p className="flex items-center gap-2">
              {t.Footer.built_with.split('♡')[0]}
              <span className="text-primary tracking-normal">❤</span>
              {t.Footer.built_with.split('♡')[1]}
            </p>
            <div className="flex gap-12">
              <a href="#" className="text-white hover:text-primary transition-colors">{t.Footer.legal}</a>
              <a href="#" className="text-whit