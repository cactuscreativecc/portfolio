import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import LoginForm from "@/components/portal/LoginForm";

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
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
            </div>

            <div className="w-full max-w-md z-10">
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
