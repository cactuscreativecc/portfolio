'use client';

import React from 'react';

interface ContactFormProps {
    t: {
        title?: string;
        name_placeholder?: string;
        email_placeholder?: string;
        project_placeholder?: string;
        budget_label?: string;
        budget_select?: string;
        budget_options?: string[];
        help_label?: string;
        help_options?: Record<string, string>;
        button_send?: string;
    };
}

export default function ContactForm({ t }: ContactFormProps) {
    if (!t) return null;

    return (
        <div className="bg-[#111] rounded-3xl p-6 md:p-16 border border-white/5">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Dual Column Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder={t.name_placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-body uppercase text-xs tracking-widest"
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="email"
                            placeholder={t.email_placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-body uppercase text-xs tracking-widest"
                        />
                    </div>
                </div>

                {/* Project Description */}
                <div>
                    <textarea
                        placeholder={t.project_placeholder}
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-body uppercase text-xs tracking-widest resize-none"
                    />
                </div>

                {/* Technical Selects & Checkboxes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-8">
                    {/* Budget Selector */}
                    <div className="space-y-6">
                        <label className="block text-white text-xs font-black uppercase tracking-[0.3em]">
                            {t.budget_label} <span className="text-primary">*</span>
                        </label>
                        <div className="relative group">
                            <select
                                defaultValue=""
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-neutral-400 appearance-none focus:outline-none focus:border-primary focus:text-white transition-all font-body uppercase text-[10px] tracking-widest cursor-pointer group-hover:bg-white/10"
                            >
                                <option value="" disabled>{t.budget_select || 'Select...'}</option>
                                {(t.budget_options || []).map((opt: string) => (
                                    <option key={opt} value={opt} className="bg-[#111] py-4">{opt}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-neutral-600 group-hover:text-primary transition-colors pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Capabilities Selection */}
                    <div className="space-y-6">
                        <label className="block text-white text-xs font-black uppercase tracking-[0.3em]">
                            {t.help_label} <span className="text-primary">*</span>
                        </label>
                        <div className="flex flex-wrap gap-4 md:gap-8">
                            {Object.entries(t.help_options || {}).map(([key, label]: [string, any]) => (
                                <label key={key} className="flex items-center gap-4 cursor-pointer group">
                                    <input type="checkbox" className="hidden peer" />
                                    <div className="w-6 h-6 border-2 border-white/10 rounded-lg flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary group-hover:border-primary/50 transition-all duration-300">
                                        <span className="material-symbols-outlined text-sm text-black opacity-0 peer-checked:opacity-100 font-bold">check</span>
                                    </div>
                                    <span className="text-xs font-bold text-neutral-500 group-hover:text-white peer-checked:text-white transition-colors uppercase tracking-widest">
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final Action */}
                <div className="pt-12">
                    <button className="w-full bg-white text-black font-black py-8 rounded-2xl hover:bg-primary transition-all duration-500 uppercase tracking-[0.4em] text-sm group flex items-center justify-center gap-4">
                        {t.button_send}
                        <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">east</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
