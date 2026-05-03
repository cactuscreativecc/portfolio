"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Message {
    role: "bot" | "user";
    text: string;
}

interface ApiMessage {
    role: "user" | "assistant";
    content: string;
}

export default function StartChat({ lang }: { lang: string }) {
    const router = useRouter();
    const isEn = lang === "en";

    const [messages, setMessages] = useState<Message[]>([]);
    const [apiHistory, setApiHistory] = useState<ApiMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isComplete) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push(`/${lang}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isComplete, router, lang]);

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
                    ? "Hello! 👋 I'm Cactus, CactusCreative's assistant. What's your company or brand name?"
                    : "Olá! 👋 Sou o Cactus, assistente da CactusCreative. Qual é o nome da sua empresa ou marca?";
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
        try {
            return JSON.parse(match[1].trim());
        } catch {
            return null;
        }
    };

    const cleanText = (text: string) =>
        text.replace(/\[BRIEFING_COMPLETE\][\s\S]*?\[\/BRIEFING_COMPLETE\]/g, "").trim();

    const saveBriefing = async (briefingData: Record<string, unknown>, history: ApiMessage[]) => {
        try {
            await fetch("/api/save-briefing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...briefingData, conversation_history: history }),
            });
        } catch (err) {
            console.error("Failed to save briefing:", err);
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading || isComplete) return;

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
                await saveBriefing(briefing, updatedHistory);
                setIsComplete(true);
            }
        } catch {
            setMessages([
                ...newMessages,
                {
                    role: "bot",
                    text: isEn ? "Connection error. Please try again." : "Erro de conexão. Tente novamente.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center w-full px-4 animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border-2 border-primary/50 animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase text-white mb-6 leading-tight tracking-tighter">
                    {isEn ? (
                        <>CAPTAIN, <br /><span className="text-primary">THE ROCKET IS FUELED!</span></>
                    ) : (
                        <>CAPITÃO, <br /><span className="text-primary">O FOGUETE ESTÁ ABASTECIDO!</span></>
                    )}
                </h2>
                <p className="font-body text-neutral-400 text-sm md:text-base uppercase tracking-tight max-w-lg mb-12 leading-relaxed">
                    {isEn
                        ? "We successfully received all your intel. One of our engineers will analyze the data and contact you within 48 hours."
                        : "Recebemos todas as suas informações com sucesso. Um dos nossos engenheiros analisará os dados e entrará em contato em até 48 horas."
                    }
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-mono font-bold text-white text-xl">
                        {countdown}
                    </div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                        {isEn ? "INITIATING RETURN SEQUENCE..." : "INICIANDO SEQUÊNCIA DE RETORNO..."}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col relative">
            <div ref={scrollContainerRef} className="overflow-y-auto px-0 space-y-6 scrollbar-hide pb-4 max-h-[55vh]">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-8 duration-700`}
                    >
                        <div
                            className={`max-w-[95%] md:max-w-[90%] py-2 text-2xl md:text-4xl xl:text-5xl font-headline uppercase leading-[1.05] tracking-tighter ${
                                msg.role === "user"
                                    ? "text-primary font-bold text-right"
                                    : "text-white font-medium"
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="py-4 flex gap-3">
                            <div className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-2 shrink-0 space-y-6 relative z-20">
                <div className="flex items-center gap-4 relative">
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
