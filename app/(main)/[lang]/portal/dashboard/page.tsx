import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import DashboardContent from "@/components/portal/DashboardContent";

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const t = await getDictionary(lang as Locale);

    return (
        <div className="min-h-screen bg-background">
            <DashboardContent lang={lang as Locale} t={t} />
        </div>
    );
}
