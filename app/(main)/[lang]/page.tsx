import React from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/get-dictionary";
import { supabase } from "@/lib/supabase";
import { Locale } from "@/i18n-config";
// import InteractiveSpotlight from "@/components/InteractiveSpotlight";
import StatsSection from "@/components/sections/StatsSection";
import FlipWord from "@/components/FlipWord";
import ClientMarquee from "@/components/ClientMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import SuccessStories from "@/components/SuccessStories";
import ProcessAccordion from "@/components/ProcessAccordion";
import { Waves } from "@/components/ui/wave-background";
import DictionarySwitcher from "@/components/DictionarySwitcher";
import ScrollToTop from "@/components/ScrollToTop";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import IdleWhatsApp from "@/components/IdleWhatsApp";
import Navbar from "@/components/Navbar";
import CTARevealSection from "@/components/CTARevealSection";
import TextReveal from "@/components/TextReveal";

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
    <div className="bg-background text-on-surface selection:bg-primary selection:text-on-primary overflow-x-hidden">
      <Navbar t={t} lang={lang as Locale} />

      <main>
        {/* HERO - Ultra Modern Digital Architecture */}
        <section id="home" className="relative min-h-screen pt-12 md:pt-20 lg:pt-20 xl:pt-24 2xl:pt-32 flex flex-col justify-center overflow-hidden">
          <Waves />
          <div className="max-w-grid mx-auto px-6 md:px-16 relative z-10 w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8 md:mb-12">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <TextReveal as="span" text={t.Hero.badge} className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none" />
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

              <p
                className="font-body text-lg md:text-xl text-neutral-500 max-w-2xl leading-relaxed uppercase tracking-tighter"
                style={{ textWrap: 'balance' } as any}
                dangerouslySetInnerHTML={{ __html: t.Hero.description }}
              />

              <div className="mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-24 flex flex-col sm:flex-row gap-4 w-full flex-wrap xl:flex-nowrap">
                <Link href={`/${lang}/start`} className="w-full sm:w-auto sm:flex-1 h-14 md:h-16 lg:h-20 group relative overflow-hidden bg-white text-black px-4 md:px-8 font-bold text-[10px] md:text-[11px] lg:text-sm tracking-[0.2em] md:tracking-[0.3em] transition-all flex items-center justify-center text-center shrink-0">
                  <span className="relative z-10 uppercase whitespace-nowrap">{t.Hero.cta_primary}</span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>

                <div className="w-full sm:w-auto sm:flex-1 h-14 md:h-16 lg:h-20 flex items-center justify-center gap-3 md:gap-4 border border-white/10 bg-white/5 px-4 md:px-8 transition-all hover:bg-white/[0.07] hover:border-white/20 shrink-0">
                  <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                    <div className="relative w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                  <div className="flex flex-col items-center sm:items-start gap-1">
                    <span className="font-label text-[7px] md:text-[8px] lg:text-[9px] tracking-[0.2em] text-neutral-500 uppercase leading-none whitespace-nowrap">
                      {lang === 'en' ? "STATUS: OPERATIONAL" : "STATUS: OPERACIONAL"}
                    </span>
                    <span className="font-headline font-bold text-[8px] md:text-[9.5px] lg:text-[12px] tracking-widest text-white uppercase leading-none whitespace-nowrap">
                      {lang === 'en'
                        ? Number(siteContent?.general?.project_slots ?? 1) === 1
                          ? 'WE HAVE ONLY 1 SLOT FOR NEW PROJECTS'
                          : `WE HAVE ${siteContent?.general?.project_slots ?? 1} SLOTS FOR NEW PROJECTS`
                        : Number(siteContent?.general?.project_slots ?? 1) === 1
                          ? 'TEMOS APENAS 1 VAGA PARA NOVOS PROJETOS'
                          : `TEMOS ${siteContent?.general?.project_slots ?? 1} VAGAS PARA NOVOS PROJETOS`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 w-full flex items-center justify-between px-8 gap-6 font-label text-[10px] tracking-[0.4em] text-neutral-800 uppercase pointer-events-none">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="whitespace-nowrap">{t.Footer.scroll_hint}</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
        </section>


        <div id="services">
          {/* Services - Technical Architecture Grid */}
          <section className="py-16 md:py-24 lg:py-28 xl:py-32 2xl:py-40 bg-background border-y border-white/5 relative z-10 w-full">
            <div className="max-w-grid mx-auto px-6 md:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-12">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <TextReveal as="span" text={t.Capabilities.label} className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none" />
                    </div>
                    <TextReveal as="h2" text={t.Capabilities.headline} className="font-headline text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight uppercase leading-none text-white mb-8 xl:mb-10 2xl:mb-12" />
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
                          <div className="flex flex-col lg:flex-row gap-4 lg:gap-px h-auto lg:h-[240px] xl:h-[280px] 2xl:h-[300px]">
                            {row1.map(renderCard)}
                          </div>
                          <div className="flex flex-col lg:flex-row gap-4 lg:gap-px h-auto lg:h-[240px] xl:h-[280px] 2xl:h-[300px]">
                            {row2.map(renderCard)}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Methodologies Accordion below Capabilities */}
                <div id="methodology" className="lg:col-span-12">
                  <ProcessAccordion lang={lang} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div id="work">
          <ProjectsSection t={t} siteContent={siteContent} lang={lang} />
        </div>

        {/* <InteractiveSpotlight /> */}

        <div id="tech">
          <StatsSection t={t.Highlights} siteContent={siteContent} lang={lang} />
        </div>

        <div id="about">
          <SuccessStories t={t} siteContent={siteContent} lang={lang} />
        </div>

        {/* Strategic Consultation - High Impact Scroll Reveal */}
        <div id="cta">
          <CTARevealSection t={t.CTA} />
        </div>

        {/* Contact Section - High Conversion Technical Form */}
        <section id="contact" className="py-16 md:py-24 xl:py-32 bg-background relative z-10 border-t border-white/5">
          <div className="max-w-grid mx-auto px-6 md:px-16">
            <div className="mb-12 md:mb-16 xl:mb-24 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <TextReveal as="span" text={t.Contact?.badge || ""} className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase leading-none" />
              </div>
              <TextReveal as="h2" text={t.Contact?.headline || ""} className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4 uppercase leading-none text-white" />
            </div>

            <ContactForm t={t.Contact} lang={lang} />
          </div>
        </section>

        {/* Client Marquee at the bottom of the page */}
        <ClientMarquee title={t.Hero.trusted_us || (lang === 'en' ? "THEY TRUSTED US" : "CLIENTES QUE ACREDITARAM EM NÓS")} clients={siteContent?.trusted_clients} />
      </main>

      {/* Footer - Premium Editorial Layout */}
      <Footer t={t} socialLinks={siteContent?.general?.social_links} />

      {/* Global Command: Scroll to Top Unit [Off-Standard] */}
      <ScrollToTop />
      <IdleWhatsApp lang={lang} />
    </div>
  );
}
