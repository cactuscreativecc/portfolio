"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function StartChat({ lang }: { lang: string }) {
    const router = useRouter();
    // Flow states
    const [step, setStep] = useState(0);
    const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isEn = lang === 'en';

    const questions = [
        isEn ? "To get started, what is your full name?" : "Para começarmos, qual é o seu nome completo?",
        isEn ? "What is the main goal of your project?" : "Qual é o objetivo principal do seu projeto?",
        isEn ? "What is your budget estimate for this challenge?" : "Qual é a sua estimativa de orçamento para esse desafio?"
    ];

    const optionsByStep: Record<number, string[]> = {
        0: [],
        1: isEn
            ? ["Web App / System Development", "High-Conversion Landing Page", "Premium E-commerce", "Still deciding"]
            : ["Desenvolvimento de um Web App / Sistema", "Landing Page de Alta Conversão", "E-commerce Premium", "Ainda estou decidindo"],
        2: isEn
            ? ["$10k - $25k", "$25k - $50k", "$50k - $100k", "Above $100k"]
            : ["R$ 15k - R$ 30k", "R$ 30k - R$ 60k", "R$ 60k - R$ 100k", "Acima de R$ 100k"]
    };

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        // Initial generic greeting
        setTimeout(() => {
            setMessages([
                { role: 'bot', text: isEn ? "Hello! Glad to have you here. From now on, things start to scale." : "Olá! Que bom ter você aqui. A partir de agora, as coisas começam a escalar." },
                { role: 'bot', text: questions[0] }
            ]);
        }, 500);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, step, isComplete]);

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

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text }]);
        setInputValue("");

        const nextStep = step + 1;

        if (nextStep < questions.length) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'bot', text: questions[nextStep] }]);
                setStep(nextStep);
            }, 800);
        } else {
            setTimeout(() => {
                setIsComplete(true);
            }, 1000);
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
                        ? "Jokes aside, we successfully received all your intel in our encrypted system. One of our engineers will analyze the data and contact you shortly."
                        : "Brincadeiras à parte, recebemos todas as suas informações com sucesso no nosso sistema criptografado. Um dos nossos engenheiros analisará os dados e entrará em contato em breve."
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
        <div className="w-full max-w-4xl mx-auto flex flex-col h-[65vh] relative mt-4">

            {/* Area de mensagens */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-2 md:px-4 space-y-8 scrollbar-hide pb-12">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
                        <div className={`max-w-[95%] md:max-w-[85%] py-2 text-2xl md:text-5xl font-headline uppercase leading-[1.1] tracking-tighter ${msg.role === 'user'
                            ? 'text-primary font-bold text-right'
                            : 'text-white font-medium'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Loader do Bot (typing indicator) */}
                {(messages.length === 0 || (messages[messages.length - 1].role === 'user' && !isComplete)) && (
                    <div className="flex justify-start">
                        <div className="py-4 flex gap-3">
                            <div className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 md:w-3 h-2 md:h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-8" />
            </div>

            {/* Area de entrada e botões elegantes */}
            <div className="pt-6 shrink-0 space-y-6 relative z-20">
                {/* Botões pré-definidos */}
                {optionsByStep[step] && optionsByStep[step].length > 0 && messages[messages.length - 1]?.role !== 'user' && (
                    <div className="flex flex-wrap gap-3 mb-2 justify-center md:justify-start">
                        {optionsByStep[step].map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(opt)}
                                className="px-6 py-3 border border-white/20 bg-white/5 backdrop-blur-sm text-[10px] md:text-xs font-bold tracking-widest text-neutral-300 uppercase hover:border-primary hover:text-black hover:bg-primary transition-all duration-300"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-4 relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? handleSend(inputValue) : null}
                        placeholder={isEn ? "TYPE YOUR ANSWER HERE..." : "DIGITE SUA RESPOSTA AQUI..."}
                        className="flex-1 bg-transparent border-b-2 border-white/10 px-0 py-4 text-white font-headline text-lg md:text-2xl focus:outline-none focus:border-primary uppercase placeholder:text-neutral-600 transition-colors"
                    />
                    <button
                        onClick={() => handleSend(inputValue)}
                        disabled={!inputValue.trim()}
                        className="w-12 h-12 flex items-center justify-center border border-white/20 hover:border-primary bg-white/5 backdrop-blur-sm hover:bg-primary hover:text-black text-white transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/20 disabled:hover:text-white"
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
