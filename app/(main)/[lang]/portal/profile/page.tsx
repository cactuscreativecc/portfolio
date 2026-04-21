import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import ProfileContent from "@/components/portal/ProfileContent";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const t = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-background">
            <ProfileContent lang={lang} t={t} />
        </div>
    );
}
