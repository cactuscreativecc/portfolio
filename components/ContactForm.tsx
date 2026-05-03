'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

interface ContactFormProps {
    t: {
        title?: string;
        name_placeholder?: string;
        email_placeholder?: string;
        phone_placeholder?: string;
        project_placeholder?: string;
        budget_label?: string;
        budget_select?: string;
        budget_options?: string[];
        help_label?: string;
        help_options?: Record<string, string>;
        button_send?: string;
    };
    lang: string;
}

export default function ContactForm({ t, lang }: ContactFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        budget: '',
        helpOptions: [] as string[]
    });

    if (!t) return null;

    const handleCheckboxChange = (option: string) => {
        setFormData(prev => ({
            ...prev,
            helpOptions: prev.helpOptions.includes(option)
                ? prev.helpOptions.filter(o => o !== option)
                : [...prev.helpOptions, option]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (result.success) {
                toast.success('MENSAGEM ENVIADA COM SUCESSO!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    budget: '',
                    helpOptions: []
                });
            } else {
                toast.error(result.error || 'ERRO AO ENVIAR MENSAGEM.');
            }
        } catch (error) {
            toast.error('ERRO DE CONEXÃO AO ENVIAR.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111] rounded-3xl p-6 md:p-16 border border-white/5">
            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Triple Column Info (Name, Email, Phone) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t.name_placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-body uppercase text-xs tracking-widest"
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t.email_placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-body uppercase text-xs tracking-widest"
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder={t.phone_placeholder || "Telefone"}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-body uppercase text-xs tracking-widest"
                        />
                    </div>
                </div>

                {/* Project Description */}
                <div>
                    <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                                required
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
                                    <input
                                        type="checkbox"
                                        className="hidden peer"
                                        checked={formData.helpOptions.includes(label)}
                                        onChange={() => handleCheckboxChange(label)}
                                    />
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
                    <button
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-8 rounded-2xl hover:bg-primary transition-all duration-500 uppercase tracking-[0.4em] text-sm group flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (lang === 'en' ? 'SENDING...' : 'ENVIANDO...') : t.button_send}
                        {!loading && <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">east</span>}
                    </button>
                </div>
            </form>
        </div>
    );
}
