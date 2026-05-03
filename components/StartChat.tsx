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

type Stage = "chat" | "generating" | "preview" | "approved";

export default function StartChat({ lang }: { lang: string }) {
    const router = useRouter();
    const isEn = lang === "en";

    const [messages, setMessages] = useState<Message[]>([]);
    const [apiHistory, setApiHistory] = useState<ApiMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState<Stage>("chat");
    const [countdown, setCountdown] = useState(5);
    const [briefingData, setBriefingData] = useState<Record<string, unknown> | null>(null);
    const [briefingId, setBriefingId] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

    useEffect(() => {
        if (stage === "approved") {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) { clearInterval(timer); router.push(`/${lang}`); return 0; }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [stage, router, lang]);

    useEffect(() => {
        const greet = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: [] }),
                });
                const data = await res.json();
                const botText = data.message ?? "";
                setMessages([{ role: "bot", text: botText }]);
                setApiHistory([{ role: "assistant", content: botText }]);
            } catch {
                const fallback = isEn
                    ? "Hey! 👋 I'm Cactus. Tell me — what's your company or brand name?"
                    : "Ei! 👋 Sou o Cactus. Me conta — qual é o nome da sua empresa ou marca?";
                setMessages([{ role: "bot", text: fallback }]);
                setApiHistory([{ role: "assistant", content: fallback }]);
            } finally {
                setIsLoading(false);
            }
        };
        greet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const extractBriefing = (text: string) => {
        const match = text.match(/\[BRIEFING_COMPLETE\]([\s\S]*?)\[\/BRIEFING_COMPLETE\]/);
        if (!match) return null;
        try { return JSON.parse(match[1].trim()); } catch { return null; }
    };

    const cleanText = (text: string) =>
        text.replace(/\[BRIEFING_COMPLETE\][\s\S]*?\[\/BRIEFING_COMPLETE\]/g, "").trim();

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

    const saveBriefing = async (data: Record<string, unknown>, history: ApiMessage[]) => {
        try {
            const res = await fetch("/api/save-briefing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, conversation_history: history }),
            });
            const json = await res.json();
            return json.id ?? null;
        } catch { return null; }
    };

    const generatePreview = async (data: Record<string, unknown>) => {
        setStage("generating");
        try {
            const res = await fetch("/api/generate-preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ briefing: data }),
            });
            const json = await res.json();
            setPreviewData(json.preview);
            setStage("preview");
        } catch {
            setStage("preview");
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading || stage !== "chat") return;

        const userMsg: Message = { role: "user", text };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

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

            const briefing = extractBriefing(botText);
            if (briefing) {
                setBriefingData(briefing);
                const id = await saveBriefing(briefing, updatedHistory);
                setBriefingId(id);
                await generatePreview(briefing);
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
            await fetch("/api/approve-briefing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ briefingId, briefingData, previewData }),
            });
        } catch { /* fail silently */ }
        setStage("approved");
    };

    const handleRevise = () => {
        setStage("chat");
        const reviseMsg = isEn
            ? "No problem! What would you like to change or add?"
            : "Sem problema! O que você gostaria de mudar ou adicionar?";
        setMessages((prev) => [...prev, { role: "bot", text: reviseMsg }]);
        setApiHistory((prev) => [...prev, { role: "assistant", content: reviseMsg }]);
    };

    // APPROVED SCREEN
    if (stage === "approved") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center w-full px-4"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border-2 border-primary/50 animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase text-white mb-6 leading-tight tracking-tighter">
                    {isEn ? <>CAPTAIN, <br /><span className="text-primary">THE ROCKET IS FUELED!</span></>
                           : <>CAPITÃO, <br /><span className="text-primary">O FOGUETE ESTÁ ABASTECIDO!</span></>}
                </h2>
                <p className="font-body text-neutral-400 text-sm md:text-base uppercase tracking-tight max-w-lg mb-12 leading-relaxed">
                    {isEn
                        ? "Your project concept has been approved and saved. Our team will reach out within 48 hours."
                        : "Seu conceito de projeto foi aprovado e salvo. Nossa equipe entrará em contato em até 48 horas."}
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-mono font-bold text-white text-xl">
                        {countdown}
                    </div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                        {isEn ? "INITIATING RETURN SEQUENCE..." : "INICIANDO SEQUÊNCIA DE RETORNO..."}
                    </span>
                </div>
            </motion.div>
        );
    }

    // GENERATING SCREEN
    if (stage === "generating") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[40vh] gap-8"
            >
                <div className="flex gap-3">
                    {[0, 150, 300].map((delay) => (
                        <div key={delay} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                </div>
                <p className="font-headline text-xl uppercase tracking-widest text-white/60">
                    {isEn ? "Building your concept..." : "Criando seu conceito..."}
                </p>
            </motion.div>
        );
    }

    // PREVIEW SCREEN
    if (stage === "preview" && previewData) {
        return (
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
                            ? "This is a structural and visual concept based on everything you shared. Approve it to lock in your spot."
                            : "Este é o conceito estrutural e visual baseado em tudo que você compartilhou. Aprove para garantir seu lugar."}
                    </p>
                </div>

                <WebsitePreview preview={previewData} company={String(briefingData?.company ?? "Your Brand")} />

                {/* Color palette display */}
                {previewData.palette && (
                    <div className="flex gap-3 flex-wrap">
                        {Object.entries(previewData.palette).map(([name, color]) => (
                            <div key={name} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded border border-white/10" style={{ backgroundColor: color as string }} />
                                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">{name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
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
        );
    }

    // CHAT SCREEN
    return (
        <div className="w-full flex flex-col relative">
            <div ref={scrollContainerRef} className="overflow-y-auto px-0 space-y-6 scrollbar-hide pb-4 max-h-[55vh]">
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
                            {[0, 150, 300].map((delay) => (
                                <div key={delay} className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: `${delay}ms` }} />
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
                        onKeyDown={(e) => e.key === "Enter" ? handleSend(inputValue) : null}
                        placeholder={isEn ? "TYPE YOUR ANSWER HERE..." : "DIGITE SUA RESPOSTA AQUI..."}
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-b-2 border-white/10 px-0 py-4 text-white font-headline text-lg md:text-2xl focus:outline-none focus:border-primary uppercase placeholder:text-neutral-600 transition-colors disabled:opacity-50"
                    />
                    <button
                        onClick={() => handleSend(inputValue)}
                        disabled={!inputValue.trim() || isLoading}
                        className="w-12 h-12 flex items-center justify-center border border-white/20 hover:border-primary bg-white/5 backdrop-blur-sm hover:bg-primary hover:text-black text-white transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/20 disabled:hover:text-white"
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
