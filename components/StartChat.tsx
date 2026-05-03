"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WebsitePreview from "./WebsitePreview";

interface Message {
    role: "bot" | "user";
    text: string;
}

interface ApiMessage {
    role: "user" | "assistant";
    content: string;
}

interface PaletteOption {
    id: string;
    name: string;
    name_pt: string;
    tag: string;
    tag_pt: string;
    palette: {
        background: string;
        surface: string;
        primary: string;
        secondary: string;
        text: string;
        textMuted: string;
        accent: string;
    };
}

type Stage = "chat" | "email_gate" | "palette_select" | "generating" | "preview" | "approved";

const STEPS_EN = ["NAME", "BRAND", "PROJECT", "GOALS", "FEATURES", "VISUAL", "CONTACT"];
const STEPS_PT = ["NOME", "MARCA", "PROJETO", "OBJETIVOS", "FEATURES", "VISUAL", "CONTATO"];

const PALETTE_OPTIONS: PaletteOption[] = [
    {
        id: "dark-bold",
        name: "DARK BOLD",
        name_pt: "DARK BOLD",
        tag: "Premium · High contrast",
        tag_pt: "Premium · Alto contraste",
        palette: {
            background: "#0a0a0a",
            surface: "#141414",
            primary: "#aed500",
            secondary: "#1a1a1a",
            text: "#ffffff",
            textMuted: "#666666",
            accent: "#aed500",
        },
    },
    {
        id: "midnight",
        name: "MIDNIGHT BLUE",
        name_pt: "AZUL MEIA-NOITE",
        tag: "Tech · Corporate",
        tag_pt: "Tech · Corporativo",
        palette: {
            background: "#0d1117",
            surface: "#161b22",
            primary: "#58a6ff",
            secondary: "#21262d",
            text: "#e6edf3",
            textMuted: "#484f58",
            accent: "#58a6ff",
        },
    },
    {
        id: "warm-luxury",
        name: "WARM LUXURY",
        name_pt: "LUXO QUENTE",
        tag: "Elegant · Premium",
        tag_pt: "Elegante · Premium",
        palette: {
            background: "#100e0a",
            surface: "#1a1712",
            primary: "#c9962e",
            secondary: "#231f19",
            text: "#f0e6d3",
            textMuted: "#8a7b68",
            accent: "#e8c97a",
        },
    },
    {
        id: "clean-light",
        name: "CLEAN LIGHT",
        name_pt: "LIMPO & CLARO",
        tag: "Minimal · Professional",
        tag_pt: "Minimalista · Profissional",
        palette: {
            background: "#f8f8f6",
            surface: "#ffffff",
            primary: "#1a1a1a",
            secondary: "#f0f0ec",
            text: "#1a1a1a",
            textMuted: "#6b6b6b",
            accent: "#1a1a1a",
        },
    },
    {
        id: "electric",
        name: "ELECTRIC",
        name_pt: "ELÉTRICO",
        tag: "Bold · Creative",
        tag_pt: "Ousado · Criativo",
        palette: {
            background: "#080810",
            surface: "#12121f",
            primary: "#7c3aed",
            secondary: "#1a1a2e",
            text: "#f0f0ff",
            textMuted: "#5b5b8b",
            accent: "#a855f7",
        },
    },
];

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({
    progress,
    isEn,
    userMsgCount,
}: {
    progress: number;
    isEn: boolean;
    userMsgCount: number;
}) {
    const steps = isEn ? STEPS_EN : STEPS_PT;
    const pct = Math.round(progress * 100);
    const activeStep = Math.min(Math.floor((userMsgCount / 14) * steps.length), steps.length - 1);

    return (
        <div className="w-full mb-8 select-none">
            <div className="flex justify-between mb-3 gap-1">
                {steps.map((step, i) => (
                    <span
                        key={i}
                        className={`text-[7px] font-black tracking-[0.15em] uppercase transition-colors duration-700 leading-none ${i <= activeStep ? "text-primary" : "text-neutral-700"
                            }`}
                    >
                        {step}
                    </span>
                ))}
            </div>

            <div className="relative h-[2px] bg-white/5 overflow-visible">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-primary origin-left"
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"
                    style={{ boxShadow: "0 0 10px #aed500, 0 0 20px #aed50066" }}
                    animate={{ left: `calc(${pct}% - 4px)` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>

            <div className="flex justify-between items-center mt-2">
                <motion.span
                    key={pct}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-[9px] text-primary font-bold"
                >
                    {pct}%
                </motion.span>
                <span className="text-[8px] font-black tracking-[0.25em] text-neutral-700 uppercase">
                    {isEn ? "BRIEFING IN PROGRESS" : "BRIEFING EM ANDAMENTO"}
                </span>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function StartChat({ lang }: { lang: string }) {
    const router = useRouter();
    const isEn = lang === "en";

    const [messages, setMessages] = useState<Message[]>([]);
    const [apiHistory, setApiHistory] = useState<ApiMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState<Stage>("chat");
    const [countdown, setCountdown] = useState(5);
    const [briefingData, setBriefingData] = useState<Record<string, unknown> | null>(null);
    const [briefingId, setBriefingId] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const [userMsgCount, setUserMsgCount] = useState(0);
    const [emailError, setEmailError] = useState("");
    const [selectedPalette, setSelectedPalette] = useState<PaletteOption | null>(null);
    const [pendingEmail, setPendingEmail] = useState("");
    const [pendingHistory, setPendingHistory] = useState<ApiMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

    useEffect(() => {
        if (stage !== "approved") return;
        const t = setInterval(() => {
            setCountdown((p) => {
                if (p <= 1) { clearInterval(t); router.push(`/${lang}`); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [stage, router, lang]);

    useEffect(() => {
        if (stage === "email_gate") {
            setTimeout(() => emailInputRef.current?.focus(), 300);
        }
    }, [stage]);

    // Initial greeting
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: [] }),
                });
                const data = await res.json();
                const text = data.message ?? "";
                setMessages([{ role: "bot", text }]);
                setApiHistory([{ role: "assistant", content: text }]);
            } catch {
                const fallback = isEn
                    ? "Hey! 👋 I'm Cactus, CactusCreative's creative consultant. Before we dive in — what's your name?"
                    : "Ei! 👋 Sou o Cactus, consultor criativo da CactusCreative. Antes de começarmos — qual é o seu nome?";
                setMessages([{ role: "bot", text: fallback }]);
                setApiHistory([{ role: "assistant", content: fallback }]);
            } finally {
                setIsLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const extractBriefing = (text: string) => {
        const match = text.match(/\[BRIEFING_COMPLETE\]([\s\S]*?)\[\/BRIEFING_COMPLETE\]/);
        if (!match) return null;
        try { return JSON.parse(match[1].trim()); } catch { return null; }
    };

    const cleanText = (text: string) =>
        text
            .replace(/\[BRIEFING_COMPLETE\][\s\S]*?\[\/BRIEFING_COMPLETE\]/g, "")
            .replace(/\[NEED_EMAIL\]/g, "")
            .trim();

    const renderBotText = (text: string) => {
        const parts = text.split(/\*\*(.*?)\*\*/g);
        return (
            <>
                {parts.map((part, i) =>
                    i % 2 === 1
                        ? <strong key={i} className="font-black text-primary">{part}</strong>
                        : <span key={i}>{part}</span>
                )}
            </>
        );
    };

    // ── Progress ───────────────────────────────────────────────────────────────

    const getProgress = () => {
        if (stage === "email_gate") return 0.88;
        if (stage === "palette_select") return 0.94;
        if (stage === "generating" || stage === "preview" || stage === "approved") return 1;
        return Math.min(userMsgCount / 14, 0.82);
    };

    // ── API Actions ────────────────────────────────────────────────────────────

    const finalizeAndPreview = async (
        data: Record<string, unknown>,
        email: string,
        history: ApiMessage[],
        palette: PaletteOption | null
    ) => {
        setStage("generating");

        const payload = { ...data, email, conversation_history: history };

        try {
            const res = await fetch("/api/briefing-finalize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (json.briefingId) setBriefingId(json.briefingId);
        } catch (e) {
            console.error("Finalize error:", e);
        }

        try {
            const res = await fetch("/api/generate-preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    briefing: payload,
                    selectedPalette: palette?.palette ?? null,
                }),
            });
            const json = await res.json();
            setPreviewData(json.preview ?? null);
        } catch {
            setPreviewData(null);
        }

        setStage("preview");
    };

    const handlePaletteSelect = async (palette: PaletteOption) => {
        setSelectedPalette(palette);
        await finalizeAndPreview(briefingData ?? {}, pendingEmail, pendingHistory, palette);
    };

    const handleEmailSubmit = async () => {
        const email = emailValue.trim();
        if (!email) { setEmailError(isEn ? "Enter your email." : "Digite seu email."); return; }
        if (!email.includes("@") || !email.includes(".")) {
            setEmailError(isEn ? "Invalid email." : "Email inválido."); return;
        }
        setEmailError("");
        setIsLoading(true);

        const emailHistory: ApiMessage[] = [...apiHistory, { role: "user", content: email }];

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: emailHistory }),
            });
            const data = await res.json();
            const botText = data.message ?? "";
            const updatedHistory: ApiMessage[] = [...emailHistory, { role: "assistant", content: botText }];
            setApiHistory(updatedHistory);

            const briefing = extractBriefing(botText);
            const finalBriefing = briefing ? { ...briefing, email } : { ...(briefingData ?? {}), email };
            setBriefingData(finalBriefing);

            // Store for palette step
            setPendingEmail(email);
            setPendingHistory(updatedHistory);

            setIsLoading(false);
            // Go to palette selection before generating
            setStage("palette_select");
            return;
        } catch (e) {
            console.error("Email submit chat error:", e);
        }

        // Fallback
        setPendingEmail(email);
        setPendingHistory(apiHistory);
        setIsLoading(false);
        setStage("palette_select");
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading || stage !== "chat") return;

        const newMessages: Message[] = [...messages, { role: "user", text }];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);
        setUserMsgCount((p) => p + 1);

        const newHistory: ApiMessage[] = [...apiHistory, { role: "user", content: text }];

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newHistory }),
            });
            const data = await res.json();
            const botText = data.message ?? (isEn ? "Sorry, try again." : "Desculpe, tente novamente.");

            const updatedHistory: ApiMessage[] = [...newHistory, { role: "assistant", content: botText }];
            setApiHistory(updatedHistory);

            const visibleText = cleanText(botText);
            setMessages([...newMessages, { role: "bot", text: visibleText }]);

            if (botText.includes("[NEED_EMAIL]")) {
                const partial = extractBriefing(botText);
                if (partial) setBriefingData(partial);
                setStage("email_gate");
                return;
            }

            const briefing = extractBriefing(botText);
            if (briefing) {
                setBriefingData(briefing);
                if (briefing.email) {
                    setPendingEmail(String(briefing.email));
                    setPendingHistory(updatedHistory);
                    setStage("palette_select");
                } else {
                    setStage("email_gate");
                }
            }
        } catch {
            setMessages([...newMessages, {
                role: "bot",
                text: isEn ? "Connection error. Please try again." : "Erro de conexão. Tente novamente.",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            if (briefingId) {
                await fetch("/api/approve-briefing", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ briefingId, briefingData, previewData }),
                });
            }
        } catch { /* silent */ }
        setStage("approved");
    };

    const handleRevise = () => {
        setStage("chat");
        const msg = isEn
            ? "No problem! What would you like to change or add?"
            : "Sem problema! O que você gostaria de mudar ou adicionar?";
        setMessages((p) => [...p, { role: "bot", text: msg }]);
        setApiHistory((p) => [...p, { role: "assistant", content: msg }]);
    };

    const progress = getProgress();
    const showProgress = stage !== "approved";

    // ── RENDER ─────────────────────────────────────────────────────────────────
    return (
        <div className="w-full flex flex-col">

            {/* Progress bar always mounted during active flow */}
            <AnimatePresence>
                {showProgress && (
                    <motion.div
                        key="progress-bar"
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <ProgressBar progress={progress} isEn={isEn} userMsgCount={userMsgCount} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── APPROVED ──────────────────────────────────────────────────── */}
            {stage === "approved" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center min-h-[50vh] text-center w-full px-4"
                >
                    <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mb-8 border-2 border-primary/50 animate-pulse">
                        <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
                    </div>
                    <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase text-white mb-6 leading-tight tracking-tighter">
                        {isEn
                            ? <><span className="text-primary">MISSION</span><br />LOCKED IN!</>
                            : <><span className="text-primary">MISSÃO</span><br />CONFIRMADA!</>}
                    </h2>
                    <p className="font-body text-neutral-400 text-sm uppercase tracking-tight max-w-lg mb-12 leading-relaxed">
                        {isEn
                            ? "Your project concept has been saved and your profile created. Our team will reach out within 48 hours."
                            : "Seu conceito foi salvo e seu perfil criado. Nossa equipe entrará em contato em até 48 horas."}
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border border-white/20 flex items-center justify-center font-mono font-bold text-white text-xl">
                            {countdown}
                        </div>
                        <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                            {isEn ? "RETURNING TO HOME..." : "VOLTANDO PARA O INÍCIO..."}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* ── GENERATING ────────────────────────────────────────────────── */}
            {stage === "generating" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center min-h-[40vh] gap-8 w-full"
                >
                    <div className="flex gap-3 mt-4">
                        {[0, 150, 300].map((d) => (
                            <div key={d} className="w-3 h-3 bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                    </div>
                    <p className="font-headline text-lg uppercase tracking-widest text-white/60">
                        {isEn ? "Building your concept..." : "Criando seu conceito..."}
                    </p>
                    {selectedPalette && (
                        <div className="flex gap-2 mt-2">
                            {Object.values(selectedPalette.palette).slice(0, 5).map((c, i) => (
                                <div key={i} className="w-6 h-6 border border-white/10" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* ── PALETTE SELECT ────────────────────────────────────────────── */}
            {stage === "palette_select" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col"
                >
                    <div className="mb-8">
                        <span className="block text-[8px] font-black tracking-[0.3em] text-primary uppercase mb-3">CACTUS</span>
                        <p className="font-body text-white text-base md:text-xl leading-relaxed font-light max-w-2xl">
                            {isEn
                                ? "Almost there! One last thing — pick the color palette that best fits your brand. This will guide your website's visual identity."
                                : "Quase lá! Última coisa — escolha a paleta de cores que melhor combina com a sua marca. Isso vai guiar a identidade visual do seu site."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PALETTE_OPTIONS.map((opt) => (
                            <motion.button
                                key={opt.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePaletteSelect(opt)}
                                className="group relative border border-white/10 hover:border-primary/50 transition-all duration-300 text-left overflow-hidden"
                            >
                                {/* Color swatches */}
                                <div className="flex h-16">
                                    <div className="flex-1" style={{ backgroundColor: opt.palette.background }} />
                                    <div className="flex-1" style={{ backgroundColor: opt.palette.surface }} />
                                    <div className="flex-1" style={{ backgroundColor: opt.palette.primary }} />
                                    <div className="flex-1" style={{ backgroundColor: opt.palette.accent }} />
                                    <div className="flex-1" style={{ backgroundColor: opt.palette.text }} />
                                </div>

                                {/* Label */}
                                <div className="p-4 bg-black/80 group-hover:bg-white/5 transition-colors">
                                    <p className="font-headline text-xs font-black tracking-[0.2em] text-white uppercase mb-1">
                                        {isEn ? opt.name : opt.name_pt}
                                    </p>
                                    <p className="text-[9px] text-neutral-500 uppercase tracking-[0.15em]">
                                        {isEn ? opt.tag : opt.tag_pt}
                                    </p>
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-primary/30" />
                                <div className="absolute top-3 right-3 w-5 h-5 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-black text-xs font-black">arrow_forward</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── EMAIL GATE ────────────────────────────────────────────────── */}
            {stage === "email_gate" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col"
                >
                    <div className="mb-10">
                        <span className="block text-[8px] font-black tracking-[0.3em] text-primary uppercase mb-3">CACTUS</span>
                        <p className="font-body text-white text-base md:text-xl leading-relaxed font-light max-w-2xl">
                            {isEn
                                ? <>Almost done! Before I generate your personalized concept, what&apos;s the best email to reach you at? We&apos;ll send the full briefing and keep the conversation going from there.</>
                                : <>Quase lá! Antes de gerar o seu conceito personalizado, qual é o melhor e-mail para entrar em contato com você? Vamos enviar o briefing completo e continuar de lá.</>}
                        </p>
                    </div>

                    <div className="max-w-xl">
                        <div className="flex items-center gap-4">
                            <input
                                ref={emailInputRef}
                                type="email"
                                value={emailValue}
                                onChange={(e) => { setEmailValue(e.target.value); setEmailError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                                placeholder={isEn ? "your@email.com" : "seu@email.com"}
                                disabled={isLoading}
                                className="flex-1 bg-transparent border-b-2 border-white/10 px-0 py-4 text-white font-headline text-lg md:text-2xl focus:outline-none focus:border-primary uppercase placeholder:text-neutral-600 placeholder:normal-case transition-colors disabled:opacity-50"
                            />
                            <button
                                onClick={handleEmailSubmit}
                                disabled={!emailValue.trim() || isLoading}
                                className="w-12 h-12 flex items-center justify-center border border-white/20 hover:border-primary bg-white/5 hover:bg-primary hover:text-black text-white transition-all disabled:opacity-30"
                            >
                                {isLoading
                                    ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    : <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                        </div>

                        {emailError && (
                            <p className="text-red-400 text-[10px] font-black tracking-widest uppercase mt-3">{emailError}</p>
                        )}

                        <div className="flex items-center gap-3 mt-6">
                            <span className="material-symbols-outlined text-neutral-700 text-sm">lock</span>
                            <p className="text-neutral-700 text-[9px] uppercase tracking-[0.25em] font-bold">
                                {isEn ? "YOUR DATA IS PRIVATE AND NEVER SHARED" : "SEUS DADOS SÃO PRIVADOS E NUNCA COMPARTILHADOS"}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── PREVIEW ───────────────────────────────────────────────────── */}
            {stage === "preview" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col gap-8"
                >
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-4">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase">
                                {isEn ? "YOUR WEBSITE CONCEPT" : "SEU CONCEITO DE SITE"}
                            </span>
                        </div>
                        <h2 className="font-headline text-3xl md:text-4xl font-black uppercase text-white tracking-tighter mb-2">
                            {isEn ? "Here's what we're" : "É assim que"}
                            {" "}<span className="text-primary">{isEn ? "building" : "vamos construir"}</span>
                        </h2>
                        <p className="text-neutral-400 text-sm max-w-lg">
                            {isEn
                                ? "Structural and visual concept based on everything you shared. Approve to lock in your spot."
                                : "Conceito estrutural e visual baseado em tudo que você compartilhou. Aprove para garantir seu lugar."}
                        </p>
                    </div>

                    {previewData
                        ? <WebsitePreview preview={previewData} company={String(briefingData?.company ?? "Your Brand")} />
                        : (
                            <div className="border border-white/10 bg-white/5 p-12 text-center">
                                <p className="text-neutral-400 text-sm uppercase tracking-widest mb-4">
                                    {isEn ? "Your briefing was received." : "Seu briefing foi recebido."}
                                </p>
                                <p className="text-neutral-600 text-xs uppercase tracking-widest">
                                    {isEn ? "Our team will prepare a visual concept and reach out within 48h." : "Nossa equipe preparará um conceito visual e entrará em contato em até 48h."}
                                </p>
                            </div>
                        )
                    }

                    {(previewData?.palette || selectedPalette) && (
                        <div className="flex gap-3 flex-wrap">
                            {Object.entries(previewData?.palette ?? selectedPalette?.palette ?? {}).map(([name, color]) => (
                                <div key={name} className="flex items-center gap-2">
                                    <div className="w-5 h-5 border border-white/10" style={{ backgroundColor: color as string }} />
                                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest">{name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleApprove}
                            className="flex-1 bg-primary text-black py-5 font-black text-xs tracking-[0.4em] uppercase hover:bg-white transition-all duration-300"
                        >
                            {isEn ? "✓ APPROVE & SUBMIT" : "✓ APROVAR & ENVIAR"}
                        </button>
                        <button
                            onClick={handleRevise}
                            className="flex-1 border border-white/20 text-white py-5 font-black text-xs tracking-[0.4em] uppercase hover:border-white transition-all duration-300"
                        >
                            {isEn ? "← REQUEST CHANGES" : "← SOLICITAR ALTERAÇÕES"}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── CHAT ──────────────────────────────────────────────────────── */}
            {stage === "chat" && (
                <div className="w-full flex flex-col relative">
                    <div
                        ref={scrollRef}
                        className="overflow-y-auto space-y-6 pb-4 max-h-[45vh] scrollbar-hide"
                    >
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "bot" ? (
                                        <div className="max-w-[88%] py-1">
                                            <span className="block text-[8px] font-black tracking-[0.3em] text-primary uppercase mb-2">CACTUS</span>
                                            <p className="font-body text-white text-base md:text-lg lg:text-xl leading-relaxed font-light">
                                                {renderBotText(msg.text)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="max-w-[75%] py-1 text-right">
                                            <p className="font-headline text-primary font-black text-sm md:text-base uppercase tracking-widest leading-snug">
                                                {msg.text}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="py-4 flex gap-3">
                                    {[0, 150, 300].map((d) => (
                                        <div key={d} className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: `${d}ms` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 shrink-0 relative z-20">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                                placeholder={isEn ? "TYPE YOUR ANSWER HERE..." : "DIGITE SUA RESPOSTA AQUI..."}
                                disabled={isLoading}
                                className="flex-1 bg-transparent border-b-2 border-white/10 px-0 py-4 text-white font-headline text-lg md:text-2xl focus:outline-none focus:border-primary uppercase placeholder:text-neutral-600 transition-colors disabled:opacity-50"
                            />
                            <button
                                onClick={() => handleSend(inputValue)}
                                disabled={!inputValue.trim() || isLoading}
                                className="w-12 h-12 flex items-center justify-center border border-white/20 hover:border-primary bg-white/5 hover:bg-primary hover:text-black text-white transition-all disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
