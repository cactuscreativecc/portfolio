"use client";

interface PreviewSection {
    id: string;
    label: string;
    type: string;
    headline?: string;
    subheadline?: string;
    description?: string;
    cta?: string;
    items?: string[];
}

interface PreviewData {
    palette: {
        background: string;
        surface: string;
        primary: string;
        secondary: string;
        text: string;
        textMuted: string;
        accent: string;
    };
    style: string;
    typography: {
        headingStyle: string;
        weight: string;
    };
    sections: PreviewSection[];
    hasNavbar: boolean;
    hasFooter: boolean;
    navItems: string[];
}

interface WebsitePreviewProps {
    preview: PreviewData;
    company: string;
}

export default function WebsitePreview({ preview, company }: WebsitePreviewProps) {
    const { palette, typography, sections, navItems } = preview;

    const headingClass = typography.headingStyle === "uppercase" ? "uppercase" : "";
    const weightClass =
        typography.weight === "black" ? "font-black" :
        typography.weight === "bold" ? "font-bold" :
        typography.weight === "thin" ? "font-light" : "font-semibold";

    return (
        <div
            className="w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl text-[10px]"
            style={{ backgroundColor: palette.background, color: palette.text, fontFamily: "sans-serif" }}
        >
            {/* Navbar */}
            <div
                className="flex items-center justify-between px-4 py-2 border-b"
                style={{ backgroundColor: palette.surface, borderColor: `${palette.text}15` }}
            >
                <span className={`text-[11px] ${weightClass} tracking-widest ${headingClass}`} style={{ color: palette.primary }}>
                    {company.toUpperCase()}
                </span>
                <div className="flex gap-4">
                    {navItems.slice(0, 4).map((item) => (
                        <span key={item} className="text-[8px] tracking-widest opacity-60" style={{ color: palette.text }}>
                            {item.toUpperCase()}
                        </span>
                    ))}
                    <span
                        className="text-[8px] tracking-widest px-2 py-1"
                        style={{ backgroundColor: palette.primary, color: palette.background }}
                    >
                        CONTACT
                    </span>
                </div>
            </div>

            {/* Sections */}
            {sections.map((section, sectionIdx) => {
                if (section.type === "hero") {
                    return (
                        <div
                            key={section.id}
                            className="px-6 py-10 flex flex-col gap-3"
                            style={{ backgroundColor: palette.background }}
                        >
                            <span className="text-[7px] tracking-[0.3em] opacity-50 uppercase" style={{ color: palette.primary }}>
                                {section.label}
                            </span>
                            <h1
                                className={`text-[18px] leading-tight ${weightClass} ${headingClass}`}
                                style={{ color: palette.text }}
                            >
                                {section.headline}
                            </h1>
                            <p className="text-[9px] leading-relaxed max-w-xs opacity-70" style={{ color: palette.text }}>
                                {section.subheadline}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <span
                                    className="text-[8px] tracking-widest px-3 py-1.5 font-bold"
                                    style={{ backgroundColor: palette.primary, color: palette.background }}
                                >
                                    {section.cta?.toUpperCase() || "GET STARTED"}
                                </span>
                                <span
                                    className="text-[8px] tracking-widest px-3 py-1.5 border"
                                    style={{ borderColor: `${palette.text}30`, color: palette.text }}
                                >
                                    LEARN MORE
                                </span>
                            </div>
                        </div>
                    );
                }

                if (section.type === "grid" && section.items) {
                    return (
                        <div
                            key={section.id}
                            className="px-6 py-6"
                            style={{ backgroundColor: palette.surface }}
                        >
                            <span className="text-[7px] tracking-[0.3em] opacity-50 uppercase block mb-1" style={{ color: palette.primary }}>
                                {section.label}
                            </span>
                            <h2 className={`text-[13px] ${weightClass} ${headingClass} mb-4`} style={{ color: palette.text }}>
                                {section.headline}
                            </h2>
                            <div className="grid grid-cols-3 gap-2">
                                {section.items.map((item) => (
                                    <div
                                        key={item}
                                        className="p-2 border text-[8px] opacity-80"
                                        style={{ borderColor: `${palette.text}20`, color: palette.text, backgroundColor: `${palette.primary}10` }}
                                    >
                                        <div
                                            className="w-3 h-3 mb-1 rounded-sm"
                                            style={{ backgroundColor: palette.primary, opacity: 0.6 }}
                                        />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                return (
                    <div
                        key={section.id}
                        className="px-6 py-6"
                        style={{ backgroundColor: sectionIdx % 2 === 0 ? palette.background : palette.surface }}
                    >
                        <span className="text-[7px] tracking-[0.3em] opacity-50 uppercase block mb-1" style={{ color: palette.primary }}>
                            {section.label}
                        </span>
                        <h2 className={`text-[13px] ${weightClass} ${headingClass} mb-2`} style={{ color: palette.text }}>
                            {section.headline}
                        </h2>
                        {section.description && (
                            <p className="text-[9px] leading-relaxed opacity-70 max-w-sm" style={{ color: palette.text }}>
                                {section.description}
                            </p>
                        )}
                    </div>
                );
            })}

            {/* Footer */}
            <div
                className="px-6 py-4 flex items-center justify-between border-t"
                style={{ backgroundColor: palette.surface, borderColor: `${palette.text}15` }}
            >
                <span className={`text-[9px] ${weightClass}`} style={{ color: palette.primary }}>
                    {company.toUpperCase()}
                </span>
                <span className="text-[7px] opacity-40" style={{ color: palette.text }}>
                    © 2026 · All rights reserved
                </span>
                <div className="flex gap-2">
                    {["Privacy", "Terms"].map((item) => (
                        <span key={item} className="text-[7px] opacity-40" style={{ color: palette.text }}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Color palette strip */}
            <div className="flex h-1">
                {Object.values(palette).map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                ))}
            </div>
        </div>
    );
}
