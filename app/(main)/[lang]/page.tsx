import React from "react";
import { getDictionary } from "@/lib/get-dictionary";
import { supabase } from "@/lib/supabase";
import { Locale } from "@/i18n-config";
import InteractiveSpotlight from "@/components/InteractiveSpotlight";
import StatsSection from "@/components/sections/StatsSection";
import FlipWord from "@/components/FlipWord";
import ClientMarquee from "@/components/ClientMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import SuccessStories from "@/components/SuccessStories";
import { Waves } from "@/components/ui/wave-background";
import DictionarySwitcher from "@/components/DictionarySwitcher";
import ScrollToTop from "@/components/ScrollToTop";
import ContactForm from "@/components/ContactForm";
import IdleWhatsApp from "@/components/IdleWhatsApp";
import Navbar from "@/components/Navbar";
import CTARevealSection from "@/components/CTARevealSection";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t: any = await getDictionary(lang as Locale);

  // Fetch Dynamic Site Content from Supabase
  const { data } = await supabase
    .from('site_content')
    .select('*')
    .eq('slug', 'landing-page')
    .single();

  const siteContent = data?.content || null;

  return (
    <div className="bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <Navbar t={t} lang={lang as Locale} />

      <main>
        {/* HERO - Ultra Modern Digital Architecture */}
        <section id="home" className="relative min-h-screen pt-32 flex flex-col justify-center overflow-hidden">
          <Waves />
          <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8 md:mb-12">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">{t.Hero.badge}</span>
              </div>

              {/* Refined Headline with Flip-Box Effect on High-Impact Words */}
              <h1 className="font-headline text-5xl md:text-[5vw] font-black leading-[0.95] tracking-tighter uppercase mb-12 md:mb-16 text-white overflow-hidden">
                {lang === 'en' ? (
                  <>
                    STOP <span className="text-primary"><FlipWord text="EXISTING" /></span>. <br />
                    START <span className="text-primary"><FlipWord text="DOMINATING" /></span>.
                  </>
                ) : (
                  <>
                    PARE DE <span className="text-primary"><FlipWord text="EXISTIR" /></span>. <br />
                    COMECE A <span className="text-primary"><FlipWord text="DOMINAR" /></span>.
                  </>
                )}
              </h1>

              <p className="font-body text-lg md:text-xl text-neutral-500 max-w-2xl leading-relaxed uppercase tracking-tighter">
                {t.Hero.description}
              </p>

              <div className="mt-20 md:mt-28 flex flex-col sm:flex-row gap-4 w-full max-w-sm md:max-w-none">
                <button className="flex-1 group relative overflow-hidden bg-white text-black px-12 py-6 font-bold text-xs md:text-base tracking-[0.3em] transition-all w-full">
                  <span className="relative z-10 uppercase">{t.Hero.cta_primary}</span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>

                <button className="flex-1 group relative border-2 border-primary text-primary px-12 py-6 font-bold text-xs md:text-base tracking-[0.3em] transition-all hover:bg-primary hover:text-black w-full">
                  <span className="uppercase">{t.Hero.cta_secondary}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 w-full flex items-center justify-between px-8 gap-6 font-label text-[10px] tracking-[0.4em] text-neutral-800 uppercase pointer-events-none">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="whitespace-nowrap">{t.Footer.scroll_hint}</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
        </section>

        <ClientMarquee title={t.Hero.trusted_us} />

        <div id="services">
          {/* Services - Technical Architecture Grid */}
          <section className="py-40 bg-background border-y border-white/5 relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                <div className="lg:col-span-12">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">{t.Capabilities.label}</span>
                    </div>
                    <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight uppercase leading-none text-white mb-12"
                      dangerouslySetInnerHTML={{ __html: t.Capabilities.headline }} />
                  </div>
                </div>

                <div className="lg:col-span-12 flex flex-col gap-4 lg:gap-px bg-transparent lg:bg-white/5">

                  <div className="lg:col-span-12 flex flex-col gap-4 lg:gap-px bg-transparent lg:bg-white/5">
                    {(() => {
                      const keys = ['tech_partner', 'web_apps', 'data_integration', 'digital_platforms', 'bespoke_solutions', 'automation_ai'];

                      const processedCaps = Array.from({ length: 6 }).map((_, idx) => {
                        const number = String(idx + 1).padStart(2, '0');
                        const key = keys[idx];
                        const scCap = siteContent?.capabilities?.[idx];

                        // Title & text from siteContent (bilingual) with fallback to dictionary
                        const title = (lang === 'en' && scCap?.title_en) ? scCap.title_en : (scCap?.title || t?.Capabilities?.[key]?.title || '');
                        const text = (lang === 'en' && scCap?.text_en) ? scCap.text_en : (scCap?.text || t?.Capabilities?.[key]?.description || '');

                        // Tag can come from siteContent if overridden, else from dictionary
                        const tagPT = scCap?.tag ||
                          ((idx === 0) ? t?.Capabilities?.tags?.subscription :
                            (idx === 2 || idx === 5) ? t?.Capabilities?.tags?.development :
                              t?.Capabilities?.tags?.available);

                        const tag = (lang === 'en' && scCap?.tag_en) ? scCap.tag_en : (lang === 'en' ? tagPT /* fallback via dictionary translation potentially */ : (scCap?.tag || tagPT));

                        const defaultColor = idx === 0 ? "neutral" : (idx === 2 || idx === 5) ? "yellow" : "primary";
                        const tag_color = scCap?.tag_color || defaultColor;

                        const icons = ['shield', 'web', 'database', 'present_to_all', 'ads_click', 'bolt'];
                        return { title, text, tag, tag_color, number, icon: icons[idx], idx };
                      });

                      const row1 = processedCaps.slice(0, 3);
                      const row2 = processedCaps.slice(3, 6);

                      const renderCard = (c: any) => (
                        <div key={c.idx} className="bg-background lg:flex-1 p-8 group hover:lg:flex-[2.5] hover:bg-primary transition-all duration-700 ease-in-out relative overflow-hidden border border-white/5 lg:border-none">
                          <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-6">
                                <div className="text-4xl font-black text-white/5 group-hover:text-black/10 transition-colors leading-none font-headline">{c.number}</div>
                                <div className={`px-2 py-0.5 border text-[9px] font-black tracking-widest uppercase transition-colors ${c.tag_color === 'neutral' ? "border-white/10 bg-white/5 text-neutral-500 group-hover:border-black/20 group-hover:text-black/40" :
                                    c.tag_color === 'yellow' ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-500 group-hover:border-black/20 group-hover:text-black/60" :
                                      c.tag_color === 'blue' ? "border-blue-500/20 bg-blue-500/5 text-blue-500 group-hover:border-black/20 group-hover:text-black/60" :
                                        c.tag_color === 'red' ? "border-red-500/20 bg-red-500/5 text-red-500 group-hover:border-black/20 group-hover:text-black/60" :
                                          "border-primary/20 bg-primary/5 text-primary group-hover:border-black/20 group-hover:text-black/60"
                                  }`}>{c.tag || "INFO"}</div>
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-black uppercase mb-4 transition-colors leading-tight">{c.title || "CAPABILITY"}</h3>
                              <p className="text-neutral-500 group-hover:text-black font-body uppercase leading-relaxed text-[12px] tracking-tight max-w-full opacity-60 group-hover:opacity-100 transition-opacity">
                                {c.text || "Description not available."}
                              </p>
                            </div>
                            <div className="mt-8 translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
                              <div className="w-10 h-10 border border-primary group-hover:border-black flex items-center justify-center text-primary group-hover:text-black">
                                <span className="material-symbols-outlined text-sm">{c.icon}</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                        </div>
                      );

                      return (
                        <>
                          <div className="flex flex-col lg:flex-row gap-4 lg:gap-px h-auto lg:h-[300px]">
                            {row1.map(renderCard)}
                          </div>
                          <div className="flex flex-col lg:flex-row gap-4 lg:gap-px h-auto lg:h-[300px]">
                            {row2.map(renderCard)}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div id="work">
          <ProjectsSection t={t} siteContent={siteContent} lang={lang} />
        </div>

        <InteractiveSpotlight />

        <div id="tech">
          <StatsSection t={t.Highlights} siteContent={siteContent} lang={lang} />
        </div>

        <div id="about">
          <SuccessStories t={t} siteContent={siteContent} />
        </div>

        {/* Strategic Consultation - High Impact Scroll Reveal */}
        <div id="cta">
          <CTARevealSection t={t.CTA} />
        </div>

        {/* Contact Section - High Conversion Technical Form */}
        <section id="contact" className="py-32 bg-background relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-24 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none">
                  {t.Contact?.badge}
                </span>
              </div>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4 uppercase leading-none text-white"
                dangerouslySetInnerHTML={{ __html: t.Contact?.headline || '' }} />
            </div>

            <ContactForm t={t.Contact} />
          </div>
        </section>
      </main>

      {/* Footer - Premium Editorial Layout */}
      <footer className="relative bg-background pt-32 pb-48 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
            <div className="md:col-span-4 space-y-8">
              <div className="text-3xl font-bold tracking-tighter text-white">CACTUSCREATIVE</div>
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
                <li><a href="#services" className="hover:text-primary transition-colors uppercase">{t.Navigation.services}</a></li>
                <li><a href="#work" className="hover:text-primary transition-colors uppercase">{t.Navigation.work}</a></li>
                <li><a href="#tech" className="hover:text-primary transition-colors uppercase">{t.Navigation.tech}</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors uppercase">{t.Navigation.about}</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors uppercase">{t.Navigation.contact}</a></li>
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

                  {/* Global Phone Channels */}
                  <div className="space-y-4 pt-4">
                    <a
                      href="https://wa.me/5513991862859?text=Ol%C3%A1%20CactusCreative!%20Gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20engenharia%20digital."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 hover:text-primary transition-all"
                    >
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-primary">[BR]</span>
                      <span>+55 13 99186-2859</span>
                    </a>
                    <a
                      href="https://wa.me/12365153775?text=Hello%20CactusCreative!%20I'd%20like%20to%20know%20more%20about%20your%20digital%20engineering%20solutions."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 hover:text-primary transition-all"
                    >
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-primary">[CA]</span>
                      <span>+1 (236) 515-3775</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Operating Hours Box */}
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

                {/* Dynamic Status Engine */}
                <div className="pt-4">
                  {(() => {
                    const now = new Date();
                    const day = now.getDay();
                    const hour = now.getHours();
                    const isWorkingHours = day >= 1 && day <= 5 && hour >= 8 && hour < 19;

                    return (
                      <div className={`inline-flex items-center gap-3 px-4 py-2 border transition-all duration-700 ${isWorkingHours
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-white/5 border-white/10 text-neutral-600 grayscale"
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${isWorkingHours ? "bg-primary animate-pulse" : "bg-neutral-800"
                          }`} />
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

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-8 font-label text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
            <p className="flex items-center gap-2">
              {t.Footer.built_with.split('♡')[0]}
              <span className="text-primary tracking-normal">❤</span>
              {t.Footer.built_with.split('♡')[1]}
            </p>
          </div>
        </div>

        {/* Massive Background Watermark */}
        <div className="absolute bottom-0 left-0 w-full select-none pointer-events-none overflow-hidden opacity-[0.04] flex justify-center translate-y-1/2">
          <h2 className="font-headline text-[18vw] font-black tracking-tighter leading-none whitespace-nowrap uppercase">
            CACTUSCREATIVE
          </h2>
        </div>
      </footer>

      {/* Global Command: Scroll to Top Unit [Off-Standard] */}
      <ScrollToTop />
      <IdleWhatsApp />
    </div>
  );
}
