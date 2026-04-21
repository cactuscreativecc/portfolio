import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function PortalLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;

    // Nota: A verificação de sessão aqui pode ser feita, mas para rotas protegidas
    // é melhor usar middleware ou verificação em rotas específicas.
    // Por enquanto, permitimos o layout geral.

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black font-body">
            {children}
        </div>
    );
}
