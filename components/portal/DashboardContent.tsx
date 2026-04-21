"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { LogOut, User, Bell } from "lucide-react";
import AdminView from "./AdminView";
import ClientView from "./ClientView";

interface DashboardContentProps {
    lang: Locale;
    t: any;
}

export default function DashboardContent({ lang, t }: DashboardContentProps) {
    const [session, setSession] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();

            if (!currentSession) {
                router.push(`/${lang}/portal`);
                return;
            }

            setSession(currentSession);

            // Buscar perfil
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

            setProfile(profileData);
            setLoading(false);

            if (currentSession?.user?.id) {
                fetchNotifications(currentSession.user.id);

                const channel = supabase
                    .channel('global-notifications')
                    .on(
                        'postgres_changes',
                        {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'notifications',
                            filter: `user_id=eq.${currentSession.user.id}`
                        },
                        (payload) => {
                            setNotifications(prev => [payload.new, ...prev]);
                            setUnreadCount(prev => prev + 1);
                        }
                    )
                    .subscribe();

                return () => {
                    supabase.removeChannel(channel);
                };
            }
        };

        checkSession();
    }, [lang, router]);

    const fetchNotifications = async (userId: string) => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    const markAsRead = async () => {
        if (!profile?.id) return;
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', profile.id)
            .eq('is_read', false);
        setUnreadCount(0);
        fetchNotifications(profile.id);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push(`/${lang}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isAdmin = profile?.role === 'admin';

    return (
        <div className="min-h-screen flex flex-col pt-24 pb-12 px-8 max-w-[1440px] mx-auto">
            {/* Header Info */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <p className="font-label text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2">
                        {t.Portal.welcome}
                    </p>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                        {profile?.full_name || 'User'}
                    </h1>
                </div>
                <div className="flex bg-surface-container-high border border-white/5 p-1 h-14 items-center">
                    {/* Notificações no lado esquerdo */}
                    <div className="relative h-full">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) markAsRead();
                            }}
                            className="flex items-center justify-center w-12 h-full text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Bell size={18} className={unreadCount > 0 ? "text-primary animate-pulse" : ""} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 bg-primary text-black w-3 h-3 flex items-center justify-center rounded-full text-[7px] font-black">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 md:left-auto md:right-0 mt-3 w-80 bg-surface-container-highest border border-white/10 shadow-2xl z-50 p-4"
                                >
                                    <h3 className="font-black text-[10px] tracking-widest uppercase text-primary mb-4">NOTIFICAÇÕES</h3>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {notifications.length > 0 ? notifications.map((n) => (
                                            <div key={n.id} className="p-3 bg-background border-l-2 border-primary hover:bg-white/5 transition-colors">
                                                <p className="text-[10px] font-black uppercase text-white mb-1">{n.title}</p>
                                                <p className="text-[9px] text-neutral-500 uppercase leading-relaxed">{n.message}</p>
                                            </div>
                                        )) : (
                                            <p className="text-[10px] text-neutral-600 uppercase text-center py-4">NENHUMA NOTIFICAÇÃO</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-[1px] h-6 bg-white/5 mx-1" />

                    <button
                        onClick={() => router.push(`/${lang}/portal/profile`)}
                        className="flex items-center gap-3 px-6 h-full font-black text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all border-r border-white/5"
                    >
                        <User size={14} className="text-primary" />
                        <span className="hidden md:inline">{t.Portal.profile_title}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-6 h-full font-black text-[10px] tracking-widest uppercase hover:bg-error hover:text-white transition-all text-neutral-400"
                    >
                        <LogOut size={14} />
                        <span className="hidden md:inline">{t.Portal.logout}</span>
                    </button>
                </div>
            </header>

            {/* Conditionally render Admin or Client View */}
            {isAdmin ? (
                <AdminView lang={lang} t={t} profile={profile} />
            ) : (
                <ClientView lang={lang} t={t} profile={profile} />
            )}
        </div>
    );
}
