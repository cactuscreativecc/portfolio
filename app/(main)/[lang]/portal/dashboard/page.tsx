import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import DashboardContent from "@/components/portal/DashboardContent";

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const t = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-background">
            <DashboardContent lang={lang} t={t} />
        </div>
    );
}
