import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { Locale, i18n } from "@/i18n-config";
import CustomCursor from "@/components/CustomCursor";
import { Toaster } from "sonner";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const revalidate = 60; // Revalidate dynamic content every 60s

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  let title = "CACTUSCREATIVE | Digital Dominance Agency";
  let description = "Agência premium especializada em criação de sites, web apps, sistemas sob medida, apresentações corporativas e mídias sociais de alta performance.";
  let ogImage = "";

  try {
    const { data } = await supabase.from('site_content').select('content').eq('slug', 'landing-page').single();
    if (data?.content?.general) {
      const gen = data.content.general;
      title = lang === 'en' && gen.meta_title_en ? gen.meta_title_en : (gen.meta_title_pt || title);
      description = lang === 'en' && gen.meta_desc_en ? gen.meta_desc_en : (gen.meta_desc_pt || description);
      ogImage = gen.og_image || '';
    }
  } catch (error) {
    console.error("Error fetching SEO:", error);
  }

  return {
    title,
    description,
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png' },
      ],
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    }
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let trackingHead = "";
  try {
    const { data } = await supabase.from('site_content').select('content').eq('slug', 'landing-page').single();
    trackingHead = data?.content?.general?.tracking_head || "";
  } catch (e) { }

  return (
    <html lang={lang} className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        {trackingHead && (
          <Script
            id="admin-tracking-head"
            dangerouslySetInnerHTML={{
              __html: `
                // Auto-injected head scripts from Admin
                try {
                  ${trackingHead.replace(/<script[^>]*>|<\/script>/gi, '')}
                } catch(e) { console.error('Tracking Injection Error:', e) }
              `}}
          />
        )}
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Toaster theme="dark" position="top-right" toastOptions={{
          style: {
            background: '#0e0e0e',
            color: '#fff',
            border: '2px solid #aed500',
            borderRadius: '0px',
            fontFamily: 'var(--font-space-grotesk)',
            textTransform: 'uppercase',
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '0.1em'
          }
        }} />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
