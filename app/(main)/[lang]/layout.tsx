import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { Locale, i18n } from "@/i18n-config";
import CustomCursor from "@/components/CustomCursor";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CACTUSCREATIVE | Sites, Sistemas, Apps e Design de Impacto",
  description: "Agência premium especializada em criação de sites, web apps, sistemas sob medida, apresentações corporativas e mídias sociais de alta performance.",
};

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

  return (
    <html lang={lang} className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
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
