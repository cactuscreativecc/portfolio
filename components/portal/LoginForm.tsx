"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import { Locale } from "@/i18n-config";

interface LoginFormProps {
    lang: Locale;
    t: any;
}

export default function LoginForm({ lang, t }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                if (data.user) {
                    router.push(`/${lang}/portal/dashboard`);
                    router.refresh();
                }
            } else {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                if (data.user) {
                    router.push(`/${lang}/portal/dashboard`);
                    router.refresh();
                }
            }
        } catch (err: any) {
            setError(err.message || t.Portal.error_invalid || "Invalid credentials");
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

            <form onSubmit={handleAuth} className="space-y-6 relative z-10">
                <div>
                    <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                        {t.Portal.email_label}
                    </label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@cactuscreative.cc"
                    />
                </div>

                <div>
                    <label className="block font-label text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-2 uppercase">
                        {t.Portal.password_label}
                    </label>
                    <div className="relative flex items-center">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-neutral-500 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {showPassword ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>
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
                    {loading ? "..." : (isLogin ? t.Portal.login_button : (lang === 'en' ? "CREATE ACCOUNT" : "CRIAR CONTA"))}
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[10px] font-label font-bold tracking-[0.1em] text-neutral-500 hover:text-white uppercase transition-colors underline decoration-white/20 underline-offset-4"
                    >
                        {isLogin
                            ? (lang === 'en' ? "NO ACCOUNT? SIGN UP" : "NÃO TEM CONTA? CADASTRE-SE")
                            : (lang === 'en' ? "ALREADY HAVE AN ACCOUNT? LOG IN" : "JÁ TEM CONTA? FAÇA LOGIN")}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
