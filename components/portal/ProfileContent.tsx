"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { ArrowLeft, Save, Lock, Mail } from "lucide-react";

interface ProfileContentProps {
    lang: Locale;
    t: any;
}

export default function ProfileContent({ lang, t }: ProfileContentProps) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form states
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push(`/${lang}/portal`);
                return;
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            setProfile(profileData);
            setFullName(profileData?.full_name || "");
            setPhone(profileData?.phone || "");
            setEmail(session.user.email || "");
            setLoading(false);
        };

        fetchProfile();
    }, [lang, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) throw new Error("No session");

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    phone: phone,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', session.user.id);

            if (profileError) throw profileError;

            // Update email if changed
            if (email !== session.user.email) {
                const { error: emailError } = await supabase.auth.updateUser({ email });
                if (emailError) throw emailError;
                setMessage({ type: 'success', text: "E-mail de confirmação enviado para o novo endereço." });
            }

            // Update password if provided and valid (min 6 chars to avoid accidental sends)
            if (newPassword && newPassword.length >= 6) {
                const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
                if (passwordError) {
                    // Se a senha for igual à antiga, apenas ignoramos ou avisamos
                    if (passwordError.message.includes("different")) {
                        console.log("Senha idêntica ignorada.");
                    } else {
                        throw passwordError;
                    }
                }

                // Update plain_password for admin visibility
                await supabase.from('profiles').update({ plain_password: newPassword }).eq('id', session.user.id);

                setNewPassword("");
                if (!message) setMessage({ type: 'success', text: "Perfil e senha atualizados com sucesso!" });
            } else if (!message) {
                setMessage({ type: 'success', text: "Perfil atualizado com sucesso!" });
            }

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-24 pb-12 px-8 max-w-3xl mx-auto">
            <button
                onClick={() => router.push(`/${lang}/portal/dashboard`)}
                className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-label text-[10px] font-bold tracking-[0.3em] uppercase">VOLTAR AO DASHBOARD</span>
            </button>

            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                    {t.Portal.profile_title}
                </h1>
                <p className="font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase mt-2">
                    GERENCIE SUAS INFORMAÇÕES PESSOAIS E DE ACESSO
                </p>
            </header>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
                {/* Profile Card */}
                <div className="bg-surface-container-high border border-white/5 p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                                {t.Portal.name_label}
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-background border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors font-headline"
                            />
                        </div>
                        <div>
                            <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                                {t.Portal.phone_label}
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-background border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors font-headline"
                                placeholder="+55 11 99999-9999"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                            {t.Portal.project_email_label}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-white/10 pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-colors font-headline"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Card */}
                <div className="bg-surface-container-high border border-white/5 p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                        <Lock size={18} className="text-primary" />
                        <h2 className="text-xl font-black tracking-tighter text-white uppercase">
                            SEGURANÇA
                        </h2>
                    </div>

                    <div>
                        <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                            {t.Portal.change_password}
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            className="w-full bg-background border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors font-headline"
                            placeholder="DIGITE A NOVA SENHA (OPCIONAL)"
                        />
                    </div>
                </div>

                {message && (
                    <div className={`p-4 ${message.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'} border border-current font-black text-[10px] tracking-widest uppercase`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center justify-center gap-3 w-full bg-primary text-black font-black py-6 tracking-[0.4em] uppercase hover:bg-white transition-all disabled:opacity-50"
                >
                    {updating ? "..." : <><Save size={18} /> {t.Portal.save_changes}</>}
                </button>
            </form>
        </div>
    );
}
