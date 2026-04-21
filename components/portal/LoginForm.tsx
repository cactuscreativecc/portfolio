"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";

interface LoginFormProps {
    lang: Locale;
    t: any;
}

export default function LoginForm({ lang, t }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            if (data.user) {
                // Redirecionar para o dashboard
                router.push(`/${lang}/portal/dashboard`);
                router.refresh();
            }
        } catch (err: any) {
            setError(t.Portal.error_invalid || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-surface-container-high border border-white/5 p-8 w-full shadow-2xl relative overflow-hidden"
        >
            {/* Shine effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-primary/20 animate-shine" />
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                <div>
                    <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                        {t.Portal.email_label}
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-background border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors font-headline"
                        placeholder="admin@cactuscreative.cc"
                    />
                </div>

                <div>
                    <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                        {t.Portal.password_label}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-background border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors font-headline"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <p className="text-error text-[10px] font-bold tracking-widest uppercase">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-black font-black py-5 tracking-[0.4em] uppercase hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "..." : t.Portal.login_button}
                </button>
            </form>
        </motion.div>
    );
}
