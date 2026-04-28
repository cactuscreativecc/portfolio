import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import LoginForm from "@/components/portal/LoginForm";
import { Waves } from "@/components/ui/wave-background";

export default async function PortalPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const t = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <Waves disableMouseFollow={true} />
            </div>

            <div className="w-full max-w-md z-10 relative">
                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                        CACTUS<span className="text-primary">PORTAL</span>
                    </h1>
                    <p className="font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase">
                        {t.Portal.login_subtitle}
                    </p>
                </div>

                <LoginForm lang={lang} t={t} />

                <div className="mt-8 text-center">
                    <p className="font-label text-[10px] font-bold tracking-[0.3em] text-neutral-600 uppercase">
                        © 2026 CactusCreative DIGITAL FOUNDRY
                    </p>
                </div>
            </div>
        </main>
    );
}
