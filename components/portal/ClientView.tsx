"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Folder,
    Clock,
    CheckCircle2,
    Paperclip,
    ChevronRight,
    MessageSquare,
    Link as LinkIcon,
    FileText,
    PenTool,
    Code,
    Database,
    Bug,
    Plus,
    Send,
    Download,
    Trash2,
    AlertCircle
} from "lucide-react";
import { Locale } from "@/i18n-config";
import { supabase } from "@/lib/supabase";
import { fetchProjectsForClient } from "@/app/actions/projects";
import { toast } from "sonner";

interface ClientViewProps {
    lang: Locale;
    t: any;
    profile: any;
}

const PROJECT_STEPS_CONFIG = [
    { id: "Briefing & Estratégia", icon: FileText },
    { id: "UX UI Design", icon: PenTool },
    { id: "Produção", icon: Code },
    { id: "Desenvolvimento Backend", icon: Database },
    { id: "QA & Bug Testing", icon: Bug },
];

export default function ClientView({ lang, t, profile }: ClientViewProps) {
    const [projects, setProjects] = useState<any[]>([]);
    const [expandedProject, setExpandedProject] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>("init");
    const [messages, setMessages] = useState<Record<string, any[]>>({});
    const [attachments, setAttachments] = useState<Record<string, any[]>>({});

    const fetchProjectData = async (projectId: string) => {
        const { data: att } = await supabase.from('attachments').select('*').eq('project_id', projectId);
        const { data: msg } = await supabase.from('messages').select('*').eq('project_id', projectId).order('created_at', { ascending: true });

        setAttachments(prev => ({ ...prev, [projectId]: att || [] }));
        setMessages(prev => ({ ...prev, [projectId]: msg || [] }));
    };

    const handleToggleProject = (projectId: string) => {
        if (expandedProject === projectId) {
            setExpandedProject(null);
        } else {
            setExpandedProject(projectId);
            if (!messages[projectId] || !attachments[projectId]) {
                fetchProjectData(projectId);
            }
        }
    };

    const handleAttachmentUpload = async (event: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `attachments/${projectId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-attachments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('project-attachments').getPublicUrl(filePath);

            const { data, error: dbError } = await supabase.from('attachments').insert([{
                project_id: projectId,
                uploaded_by: profile.id,
                name: file.name,
                file_path: filePath,
                file_url: publicUrl,
                file_size: file.size,
                file_type: file.type
            }]).select().single();

            if (dbError) throw dbError;

            setAttachments(prev => ({
                ...prev,
                [projectId]: [...(prev[projectId] || []), data]
            }));

            toast.success("Arquivo enviado com sucesso!");
        } catch (error: any) {
            toast.error("Erro ao enviar arquivo: " + error.message);
        }
    };

    const handleSendMessage = async (projectId: string) => {
        const inputId = `chat-input-${projectId}`;
        const input = document.getElementById(inputId) as HTMLInputElement;
        const content = input?.value?.trim();

        if (!content) return;

        try {
            const { error } = await supabase.from('messages').insert([{
                project_id: projectId,
                sender_id: profile.id,
                content: content
            }]);

            if (error) throw error;
            input.value = '';
        } catch (error: any) {
            toast.error("Erro ao enviar mensagem.");
        }
    };

    const deleteAttachment = async (attachment: any) => {
        if (!confirm("Remover este arquivo?")) return;
        try {
            await supabase.storage.from('project-attachments').remove([attachment.file_path]);
            const { error } = await supabase.from('attachments').delete().eq('id', attachment.id);
            if (error) throw error;

            setAttachments(prev => ({
                ...prev,
                [attachment.project_id]: prev[attachment.project_id].filter((a: any) => a.id !== attachment.id)
            }));
            toast.success("Arquivo removido.");
        } catch (error: any) {
            toast.error("Erro ao remover.");
        }
    };

    useEffect(() => {
        if (expandedProject) {
            const container = document.getElementById(`chat-scroll-${expandedProject}`);
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [messages, expandedProject]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await fetchProjectsForClient(profile.id);
                if (!error && data) {
                    setProjects(data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchProjects();

        const projectsChannel = supabase.channel('realtime-client-projects')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'projects',
                filter: `client_id=eq.${profile.id}`
            }, () => {
                toast('Seu projeto foi atualizado!', { icon: '🚀' });
                fetchProjects();
            })
            .subscribe();

        const messagesChannel = supabase.channel('realtime-client-messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            }, (payload: any) => {
                const newMessage = payload.new;
                setMessages((prev: any) => {
                    const projectMsgs = prev[newMessage.project_id] || [];
                    if (projectMsgs.some((m: any) => m.id === newMessage.id)) return prev;
                    return { ...prev, [newMessage.project_id]: [...projectMsgs, newMessage] };
                });

                if (newMessage.sender_id !== profile.id) {
                    toast.info("Nova mensagem recebida!", { icon: '💬' });
                }
            })
            .subscribe();

        const attachmentsChannel = supabase.channel('realtime-client-attachments')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'attachments'
            }, (payload: any) => {
                const newAtt = payload.new;
                const oldAtt = payload.old;

                if (payload.eventType === 'INSERT') {
                    setAttachments((prev: any) => {
                        const existing = prev[newAtt.project_id] || [];
                        if (existing.some((a: any) => a.id === newAtt.id)) return prev;
                        return { ...prev, [newAtt.project_id]: [...existing, newAtt] };
                    });
                } else if (payload.eventType === 'DELETE') {
                    setAttachments((prev: any) => {
                        const newState = { ...prev };
                        for (const pid in newState) {
                            newState[pid] = newState[pid].filter((a: any) => a.id !== oldAtt.id);
                        }
                        return newState;
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(projectsChannel);
            supabase.removeChannel(messagesChannel);
            supabase.removeChannel(attachmentsChannel);
        };
    }, [profile.id, supabase]);

    return (
        <div className="w-full space-y-10">
            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <h2 className="text-xl font-black tracking-tighter text-white uppercase">
                        MEUS PROJETOS
                    </h2>
                    <div className="flex gap-6">
                        <span className="font-label text-[10px] font-bold tracking-[0.3em] text-primary border-b border-primary pb-1">
                            ATIVOS ({projects.length})
                        </span>
                    </div>
                </div>

                {/* Vertical List of Projects */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {projects.length > 0 ? projects.map((proj) => (
                            <motion.div
                                key={proj.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className={`bg-surface-container-high border ${expandedProject === proj.id ? 'border-primary/50 ring-1 ring-primary/20' : 'border-white/5'} p-8 group hover:border-primary/30 transition-all duration-500 cursor-pointer w-full flex flex-col`}
                                onClick={() => handleToggleProject(proj.id)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase mb-3">
                                            {proj.status}
                                        </span>
                                        <h3 className="text-2xl font-black tracking-tighter text-white uppercase group-hover:text-primary transition-colors">
                                            {proj.name}
                                        </h3>
                                        <p className="text-[10px] text-neutral-500 tracking-widest uppercase mt-2 max-w-lg">
                                            {proj.description}
                                        </p>
                                    </div>
                                    <ChevronRight className={`text-neutral-600 transition-transform duration-500 ${expandedProject === proj.id ? 'rotate-90 text-primary' : ''}`} />
                                </div>

                                {/* Visual Step-by-step Tracker */}
                                <div className="pt-6 relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-label text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase">
                                            FASES DO PROJETO
                                        </span>
                                    </div>

                                    {/* Main Green Progress Bar */}
                                    <div className="space-y-2 mb-10 bg-surface-container-high p-4 border border-white/5">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="font-label text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase mb-2">
                                                    STATUS DO PROJETO
                                                </span>
                                                <span className="text-2xl font-black text-white tracking-tighter uppercase">
                                                    {proj.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-label text-[10px] font-black tracking-[0.3em] text-primary uppercase block mb-1">
                                                    CONCLUSÃO
                                                </span>
                                                <span className="text-6xl font-black text-primary leading-none tracking-tighter">
                                                    {proj.current_step}<span className="text-[20px] ml-1 opacity-50">%</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-4 w-full bg-black border border-white/10 shadow-inner mt-4">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 shadow-[0_0_20px_rgba(174,213,0,0.6)]"
                                                style={{ width: `${proj.current_step}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative mt-8">
                                        {/* Line connecting the steps */}
                                        <div className="absolute top-5 left-[5%] right-[5%] h-[2px] bg-white/5 z-0"></div>

                                        <div className="flex justify-between relative z-10 w-full">
                                            {PROJECT_STEPS_CONFIG.map((step, idx) => {
                                                const currentStepIndex = PROJECT_STEPS_CONFIG.findIndex(s => s.id === proj.status);
                                                const isPastOrCurrent = idx <= currentStepIndex;
                                                const isCurrent = idx === currentStepIndex;
                                                const Icon = step.icon;

                                                return (
                                                    <div key={idx} className="flex flex-col items-center gap-4 relative group w-[20%]">
                                                        {/* Step Circle */}
                                                        <motion.div
                                                            className={`w-12 h-12 border-2 flex items-center justify-center bg-[#0e0e0e] relative z-10 transition-colors duration-500
                                                                ${isCurrent ? 'border-primary text-primary shadow-[0_0_25px_rgba(174,213,0,0.3)]' :
                                                                    isPastOrCurrent ? 'border-primary/50 text-primary/80' :
                                                                        'border-white/10 text-neutral-600'}`
                                                            }
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: isCurrent ? 1.1 : 1, opacity: 1 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                        >
                                                            {isPastOrCurrent && !isCurrent ? (
                                                                <CheckCircle2 size={18} className="text-primary" />
                                                            ) : (
                                                                <Icon size={18} />
                                                            )}
                                                        </motion.div>

                                                        {/* Step Label */}
                                                        <p className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center px-1
                                                            ${isCurrent ? 'text-primary' :
                                                                isPastOrCurrent ? 'text-white' :
                                                                    'text-neutral-500'}`}
                                                        >
                                                            {step.id}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Animated Progress Line */}
                                        {(() => {
                                            const currentStepIndex = PROJECT_STEPS_CONFIG.findIndex(s => s.id === proj.status);
                                            if (currentStepIndex <= 0) return null;
                                            const widthPercentage = (currentStepIndex / (PROJECT_STEPS_CONFIG.length - 1)) * 90;

                                            return (
                                                <motion.div
                                                    className="absolute top-5 left-[5%] h-[2px] bg-primary z-0 shadow-[0_0_15px_rgba(174,213,0,0.5)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${widthPercentage}%` }}
                                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                                />
                                            );
                                        })()}
                                    </div>

                                    {proj.production_link && (
                                        <div className="pt-8 flex justify-center w-full">
                                            <a href={proj.production_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase text-black bg-primary px-8 py-3 hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(174,213,0,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]" onClick={(e) => e.stopPropagation()}>
                                                <LinkIcon size={14} />
                                                ACESSAR AMBIENTE / PROJETO EXTERNO
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Content: Files & Chat */}
                                {expandedProject === proj.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 pt-8 border-t border-white/5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                            {/* COLUNA: ARQUIVOS */}
                                            <div className="lg:col-span-4 flex flex-col space-y-4">
                                                <div className="flex justify-between items-center h-10 pr-2">
                                                    <h5 className="text-[10px] uppercase font-black text-primary tracking-[0.3em] flex items-center gap-2">
                                                        <span className="w-1 h-3 bg-primary inline-block"></span>
                                                        ARQUIVOS DO PROJETO
                                                    </h5>
                                                    <label className="cursor-pointer group">
                                                        <input type="file" className="hidden" onChange={(e) => handleAttachmentUpload(e, proj.id)} />
                                                        <div className="bg-primary/10 border border-primary/20 p-2 group-hover:bg-primary group-hover:text-black transition-all">
                                                            <Plus className="w-3 h-3 text-primary group-hover:text-black" />
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="bg-surface-container-high/40 border border-white/5 p-4 h-[320px] overflow-y-auto custom-scrollbar">
                                                    {attachments[proj.id]?.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {attachments[proj.id].map((file: any) => (
                                                                <div key={file.id} className="flex justify-between items-center group p-3 bg-background/40 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
                                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                                        <FileText className="w-4 h-4 text-neutral-600 group-hover:text-primary transition-colors shrink-0" />
                                                                        <span className="text-[10px] text-neutral-400 uppercase font-black truncate tracking-widest group-hover:text-white transition-colors">{file.name}</span>
                                                                    </div>
                                                                    <div className="flex gap-1">
                                                                        <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-600 hover:text-primary transition-colors">
                                                                            <Download className="w-3.5 h-3.5" />
                                                                        </a>
                                                                        {file.uploaded_by === profile.id && (
                                                                            <button onClick={() => deleteAttachment(file)} className="p-2 text-neutral-600 hover:text-red-500 transition-colors">
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                                                            <FileText className="w-8 h-8 text-neutral-600 mb-2" />
                                                            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest text-center">NENHUM ARQUIVO ANEXADO AINDA</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* COLUNA: CHAT */}
                                            <div className="lg:col-span-8 flex flex-col space-y-4">
                                                <div className="flex items-center h-10">
                                                    <h5 className="text-[10px] uppercase font-black text-primary tracking-[0.3em] flex items-center gap-2">
                                                        <span className="w-1 h-3 bg-primary inline-block"></span>
                                                        CENTRO DE MENSAGENS
                                                    </h5>
                                                </div>

                                                <div className="bg-surface-container-high/40 border border-white/5 flex flex-col h-[320px] relative overflow-hidden">
                                                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#aed500_1px,transparent_1px)] [background-size:24px_24px]"></div>

                                                    <div
                                                        id={`chat-scroll-${proj.id}`}
                                                        className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative z-10"
                                                    >
                                                        {messages[proj.id]?.length > 0 ? messages[proj.id].map((msg: any) => {
                                                            const isMe = msg.sender_id === profile.id;
                                                            return (
                                                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end pl-16' : 'items-start pr-16'}`}>
                                                                    <div className={`relative px-5 py-4 border-l-2 transition-all duration-300 ${isMe
                                                                        ? 'bg-primary/5 border-primary text-primary shadow-[10px_0_30px_-5px_rgba(174,213,0,0.05)]'
                                                                        : 'bg-white/5 border-neutral-700 text-neutral-300'
                                                                        }`}>
                                                                        <p className="text-[11px] font-medium leading-relaxed tracking-wide">{msg.content}</p>
                                                                    </div>
                                                                    <div className={`flex gap-3 mt-3 text-[8px] font-black uppercase tracking-[0.2em] ${isMe ? 'flex-row-reverse text-primary/40' : 'text-neutral-600'}`}>
                                                                        <span>{isMe ? 'VOCÊ' : 'EQUIPE CACTUS'}</span>
                                                                        <span className="opacity-20">•</span>
                                                                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }) : (
                                                            <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-20">
                                                                <MessageSquare className="w-10 h-10 text-primary mb-4" />
                                                                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] leading-loose">
                                                                    INICIE UMA CONVERSA PARA<br />ALINHAMENTOS DO PROJETO
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-4 bg-background/40 backdrop-blur-sm border-t border-white/5 relative z-10">
                                                        <div className="flex gap-2 bg-surface-container-high border border-white/5 p-1 focus-within:border-primary/40 transition-all">
                                                            <input
                                                                id={`chat-input-${proj.id}`}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(proj.id)}
                                                                placeholder="DIGITE SUA MENSAGEM..."
                                                                className="flex-1 bg-transparent px-4 py-3 text-[10px] font-black text-white focus:outline-none placeholder:text-neutral-700 uppercase tracking-widest"
                                                            />
                                                            <button
                                                                onClick={() => handleSendMessage(proj.id)}
                                                                className="bg-primary text-black w-12 flex items-center justify-center hover:bg-white transition-all active:scale-95"
                                                            >
                                                                <Send size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )) : (
                            <div className="text-center py-20 border border-dashed border-white/10">
                                <h3 className="text-xl font-black text-white tracking-widest uppercase mb-2">Nada por aqui ainda</h3>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest">Nenhum projeto associado ao seu perfil no momento.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
