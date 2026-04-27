"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
    Users,
    Layers,
    Settings,
    Bell,
    Search,
    Plus,
    FileText,
    ChevronRight,
    CheckCircle,
    Clock,
    AlertCircle,
    Paperclip,
    Send,
    Download,
    Trash2,
    MessageSquare,
    Edit,
    Sparkles,
    X,
    Layout,
    Star,
    BarChart3,
    CheckSquare
} from "lucide-react";
import { Locale } from "@/i18n-config";
import { toast } from "sonner";

interface AdminViewProps {
    lang: Locale;
    t: any;
    profile: any;
}

type AdminTab = 'clients' | 'projects' | 'customization';

export default function AdminView({ lang, t, profile }: AdminViewProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('clients');

    // CMS State
    const [siteContent, setSiteContent] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState<number | null>(null);
    const [activeCustomTab, setActiveCustomTab] = useState<'general' | 'capabilities' | 'projects' | 'stats' | 'stories'>('general');
    const [isGeneratingAI, setIsGeneratingAI] = useState<number | null>(null);

    // Clients State
    const [clients, setClients] = useState<any[]>([]);
    const [expandedClient, setExpandedClient] = useState<string | null>(null);
    const [clientData, setClientData] = useState<Record<string, any>>({});

    // Projects State
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [expandedProject, setExpandedProject] = useState<string | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `project-${Date.now()}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            setUploadingImage(idx);

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);

            setSiteContent((prev: any) => {
                if (!prev) return prev;
                const newProjs = [...prev.featured_projects];
                newProjs[idx] = { ...newProjs[idx], image: data.publicUrl };
                return { ...prev, featured_projects: newProjs };
            });
            toast.success("Imagem anexada com sucesso!");
        } catch (error: any) {
            toast.error('Erro ao fazer upload da imagem. Certifique-se de que o bucket "portfolio" existe no Storage e tem políticas públicas. Erro: ' + error.message);
        } finally {
            setUploadingImage(null);
        }
    };

    const handleOGImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `og-image-${Date.now()}.${fileExt}`;
            const filePath = `config/${fileName}`;

            const toastId = toast.loading("Enviando imagem...");

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);

            setSiteContent((prev: any) => ({
                ...prev,
                general: {
                    ...(prev?.general || {}),
                    og_image: data.publicUrl
                }
            }));

            toast.success("Imagem oficial definida!", { id: toastId });
        } catch (error: any) {
            toast.error('Erro: ' + error.message);
        }
    };

    const handleGenerateAIDescription = async (idx: number) => {
        const imageUrl = siteContent.featured_projects[idx].image;
        if (!imageUrl) {
            toast.error("Por favor, faça o upload de uma imagem primeiro.");
            return;
        }

        setIsGeneratingAI(idx);
        try {
            const res = await fetch('/api/admin/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSiteContent((prev: any) => {
                if (!prev) return prev;
                const newProjs = [...prev.featured_projects];
                newProjs[idx] = { ...newProjs[idx], description: data.description };
                return { ...prev, featured_projects: newProjs };
            });
            toast.success("Descrição gerada com IA!");
        } catch (error: any) {
            toast.error("Erro ao gerar descrição: " + error.message);
        } finally {
            setIsGeneratingAI(null);
        }
    };

    const addSuccessStory = () => {
        const newStory = {
            name: "Novo Cliente",
            profession: "Empresa / Cargo",
            link: "#",
            comment: ""
        };
        const newStories = [...(siteContent.success_stories || []), newStory];
        updateSection('success_stories', newStories);
        toast.success("Nova história adicionada!");
    };

    const toggleClientExpand = async (clientId: string) => {
        if (expandedClient === clientId) {
            setExpandedClient(null);
            return;
        }
        setExpandedClient(clientId);

        if (!clientData[clientId]) {
            const { data: projectsData } = await supabase.from('projects').select('*').eq('client_id', clientId);

            // Fetch attachments and messages for all projects of this client
            const projectIds = projectsData?.map(p => p.id) || [];

            let attachmentsData: any[] = [];
            let messagesData: any[] = [];

            if (projectIds.length > 0) {
                const { data: att } = await supabase.from('attachments').select('*').in('project_id', projectIds);
                const { data: msg } = await supabase.from('messages').select('*').in('project_id', projectIds).order('created_at', { ascending: true });
                attachmentsData = att || [];
                messagesData = msg || [];
            }

            setClientData(prev => ({
                ...prev,
                [clientId]: {
                    projects: projectsData || [],
                    attachments: attachmentsData,
                    messages: messagesData,
                    activeProjectId: projectsData?.[0]?.id || null
                }
            }));
        }
    };

    const handleAttachmentUpload = async (event: React.ChangeEvent<HTMLInputElement>, projectId: string, clientId: string) => {
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
                file_name: file.name,
                file_path: filePath,
                file_url: publicUrl,
                file_size: file.size,
                file_type: file.type
            }]).select().single();

            if (dbError) throw dbError;

            setClientData(prev => ({
                ...prev,
                [clientId]: {
                    ...prev[clientId],
                    attachments: [...(prev[clientId]?.attachments || []), data]
                }
            }));

            toast.success("Arquivo enviado com sucesso!");
        } catch (error: any) {
            toast.error("Erro ao enviar arquivo: " + error.message);
        }
    };

    const handleSendMessage = async (clientId: string, projectId: string) => {
        const inputId = `proj-chat-input-${projectId}`;
        const input = document.getElementById(inputId) as HTMLInputElement;
        const content = input?.value?.trim();

        if (!content || !projectId) return;

        try {
            const { error } = await supabase.from('messages').insert([{
                project_id: projectId,
                sender_id: profile.id,
                content: content
            }]);

            if (error) throw error;
            input.value = '';
        } catch (error: any) {
            console.error("Erro ao enviar mensagem:", error);
            toast.error("Erro ao enviar.");
        }
    };

    const deleteAttachment = async (attachment: any, clientId: string) => {
        if (!confirm("Remover este arquivo?")) return;
        try {
            await supabase.storage.from('project-attachments').remove([attachment.file_path]);
            const { error } = await supabase.from('attachments').delete().eq('id', attachment.id);
            if (error) throw error;

            setClientData(prev => ({
                ...prev,
                [clientId]: {
                    ...prev[clientId],
                    attachments: prev[clientId].attachments.filter((a: any) => a.id !== attachment.id)
                }
            }));
            toast.success("Arquivo removido.");
        } catch (error: any) {
            toast.error("Erro ao remover.");
        }
    };

    const saveClientData = async (clientId: string) => {
        const fullName = (document.getElementById(`client-name-${clientId}`) as HTMLInputElement)?.value;
        const email = (document.getElementById(`client-email-${clientId}`) as HTMLInputElement)?.value;
        const phone = (document.getElementById(`client-phone-${clientId}`) as HTMLInputElement)?.value;
        const password = (document.getElementById(`client-pwd-${clientId}`) as HTMLInputElement)?.value;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/update-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId,
                    fullName,
                    email,
                    phone,
                    password,
                    adminToken: session?.access_token
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success('Dados do cliente atualizados com sucesso!');
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, full_name: fullName, email, phone } : c));

            const pwdInput = document.getElementById(`client-pwd-${clientId}`) as HTMLInputElement;
            if (password && pwdInput) {
                pwdInput.value = '';
            }
        } catch (err: any) {
            toast.error('Erro ao atualizar: ' + err.message);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
        const clientId = (form.elements.namedItem('client_id') as HTMLSelectElement).value;
        const status = (form.elements.namedItem('status') as HTMLSelectElement).value;

        try {
            const { data, error } = await supabase.from('projects').insert([{
                name,
                description,
                client_id: clientId,
                status,
                current_step: 0,
                is_new: true
            }]).select();

            if (error) throw error;

            toast.success('Projeto criado com sucesso! Agora você pode anexar arquivos e conversar com o cliente.');
            if (data && data.length > 0) {
                setAllProjects(prev => [data[0], ...prev]);
                setClientData(prev => ({
                    ...prev,
                    [clientId]: {
                        ...prev[clientId],
                        projects: [data[0], ...(prev[clientId]?.projects || [])]
                    }
                }));
                setExpandedProject(data[0].id);
                setIsCreatingProject(false);
            }
        } catch (error: any) {
            toast.error('Erro ao criar projeto: ' + error.message);
        }
    };

    const saveProjectData = async (projId: string) => {
        const status = (document.getElementById(`proj-status-${projId}`) as HTMLSelectElement)?.value;
        const currentStep = (document.getElementById(`proj-step-${projId}`) as HTMLInputElement)?.value;
        const productionLink = (document.getElementById(`proj-link-${projId}`) as HTMLInputElement)?.value;
        const name = (document.getElementById(`proj-name-${projId}`) as HTMLInputElement)?.value;
        const description = (document.getElementById(`proj-desc-${projId}`) as HTMLTextAreaElement)?.value;

        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    status,
                    current_step: parseInt(currentStep),
                    production_link: productionLink,
                    name,
                    description
                })
                .eq('id', projId);

            if (error) {
                if (error.message.includes('production_link')) {
                    toast.error('Por favor, adicione a coluna "production_link" (text) na tabela projects no banco de dados.');
                    return;
                }
                throw error;
            }

            toast.success('Projeto atualizado com sucesso!');
            setAllProjects(prev => prev.map(p => p.id === projId ? {
                ...p,
                status,
                current_step: parseInt(currentStep),
                production_link: productionLink,
                name,
                description
            } : p));

            setClientData(prev => {
                const newData = { ...prev };
                for (const clientId in newData) {
                    if (newData[clientId].projects) {
                        newData[clientId].projects = newData[clientId].projects.map((p: any) =>
                            p.id === projId ? { ...p, status, current_step: parseInt(currentStep), name, description, production_link: productionLink } : p
                        );
                    }
                }
                return newData;
            });
        } catch (err: any) {
            toast.error('Erro ao salvar: ' + err.message);
        }
    };

    const deleteProject = async (projId: string) => {
        if (!confirm("TEM CERTEZA QUE DESEJA EXCLUIR ESTE PROJETO? ESTA AÇÃO É IRREVERSÍVEL E TODOS OS ARQUIVOS E MENSAGENS SERÃO PERDIDOS.")) return;

        try {
            const { error } = await supabase.from('projects').delete().eq('id', projId);
            if (error) throw error;

            toast.success('Projeto excluído com sucesso.');
            setAllProjects(prev => prev.filter(p => p.id !== projId));
            setClientData(prev => {
                const newData = { ...prev };
                for (const clientId in newData) {
                    if (newData[clientId].projects) {
                        newData[clientId].projects = newData[clientId].projects.filter((p: any) => p.id !== projId);
                    }
                }
                return newData;
            });
            setExpandedProject(null);
        } catch (err: any) {
            toast.error('Erro ao excluir: ' + err.message);
        }
    };

    // Efeito para Scroll Automático do Chat no Admin
    useEffect(() => {
        const scrollToBottom = () => {
            const containers = document.querySelectorAll('[id^="chat-scroll-"]');
            containers.forEach(container => {
                container.scrollTop = container.scrollHeight;
            });
        };
        scrollToBottom();
    }, [clientData]);

    useEffect(() => {
        const fetchAllData = async () => {
            const { data: clientsData } = await supabase.from('profiles').select('*').eq('role', 'client');
            if (clientsData) setClients(clientsData);

            const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (projectsData) setAllProjects(projectsData);
        };
        fetchAllData();

        fetchSiteContent();

        // Realtime Subscriptions
        const messagesChannel = supabase.channel('admin-messages-all')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMessage = payload.new as any;
                // Only mark as notify if sender is not current admin
                if (newMessage.sender_id !== profile.id) {
                    toast.info("Nova mensagem de cliente recebida!", { icon: '💬' });
                }

                setClientData(prev => {
                    const newData = { ...prev };
                    for (const cid in newData) {
                        const hasProject = newData[cid].projects?.some((p: any) => p.id === newMessage.project_id);
                        if (hasProject) {
                            const existing = newData[cid].messages || [];
                            if (!existing.some((m: any) => m.id === newMessage.id)) {
                                newData[cid].messages = [...existing, newMessage];
                            }
                        }
                    }
                    return newData;
                });
            })
            .subscribe();

        const attachmentsChannel = supabase.channel('admin-attachments-all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'attachments' }, (payload) => {
                const newAtt = payload.new as any;
                const oldAtt = payload.old as any;

                setClientData(prev => {
                    const newData = { ...prev };
                    if (payload.eventType === 'INSERT') {
                        for (const cid in newData) {
                            const hasProject = newData[cid].projects?.some((p: any) => p.id === newAtt.project_id);
                            if (hasProject) {
                                const existing = newData[cid].attachments || [];
                                if (!existing.some((a: any) => a.id === newAtt.id)) {
                                    newData[cid].attachments = [...existing, newAtt];
                                }
                            }
                        }
                    } else if (payload.eventType === 'DELETE') {
                        for (const cid in newData) {
                            if (newData[cid].attachments) {
                                newData[cid].attachments = newData[cid].attachments.filter((a: any) => a.id !== oldAtt.id);
                            }
                        }
                    }
                    return newData;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
            supabase.removeChannel(attachmentsChannel);
        };
    }, [profile.id]);

    const fetchSiteContent = async () => {
        const { data } = await supabase
            .from('site_content')
            .select('*')
            .eq('slug', 'landing-page')
            .single();

        if (data) {
            let content = data.content;
            if (!content.success_stories) {
                content.success_stories = [
                    { name: "Marcelo Linhares", profession: "CEO", link: "#", comment: "A Cactus Creative entregou muito mais que um site; eles reestruturaram a nossa comunicação digital inteira. O trato que a equipe nos deu foi excepcional do primeiro dia até a entrega, que por sinal ficou impecável." },
                    { name: "Camila Rodrigues", profession: "Diretora de Marketing", link: "#", comment: "Profissionalismo puro. O processo deles é super transparente, toda quarta-feira sabíamos exatamente em que pé estava o projeto. O resultado final nos trouxe enorme crescimento de leads." },
                    { name: "Fernando Souza", profession: "CTO", link: "#", comment: "A Cactus Creative pegou um problema técnico gigante nosso e transformou numa plataforma fluida e rápida. A paciência e clareza com que trataram nosso time foi um grande diferencial!" },
                    { name: "Letícia Monteiro", profession: "Founder", link: "#", comment: "Contratar a Cactus foi a melhor decisão pro nosso reposicionamento. A identidade e a interface refletem a alma do negócio. O atendimento deles? Parece que eles fazem parte da sua própria empresa." },
                    { name: "Roberto Farias", profession: "Head of Growth", link: "#", comment: "Não é só código e design, é estratégia pura. Mergulharam no briefing e entregaram uma máquina de vendas. Sem falar no acolhimento de toda a equipe que esteve lado a lado." },
                    { name: "Heloísa Becker", profession: "Product Manager", link: "#", comment: "O que mais me surpreendeu na Cactus Creative foi o absoluto rigor com qualidade, prazos e o cuidado impecável na comunicação de todo o time." },
                    { name: "Diego Ferreira", profession: "Co-fundador", link: "#", comment: "Transformaram uma ideia extremamente abstrata num portal robusto e lindíssimo em tempo recorde. A capacidade técnica junto ao excelente atendimento faz deles um parceiro vitalício." },
                    { name: "Carolina Mattos", profession: "Ops Manager", link: "#", comment: "Impecável. Todo o fluxo de aprovação e desenvolvimento do nosso app foi guiado com uma maestria que você só encontra nas maiores agências do mundo. Recomendo sempre." },
                    { name: "Ricardo Almeida", profession: "Tech Lead", link: "#", comment: "Agência que não te abandona pós-deploy. A Cactus Creative nos abraçou de um jeito que poucos fazem. Estabilidade, design primoroso e muito suporte humano ao longo das sprints." },
                    { name: "Juliana Silva", profession: "Diretora Operacional", link: "#", comment: "A clareza técnica e o cuidado estético deles são difíceis de encontrar num lugar só. Todo o projeto rodou sem dores de cabeça, me senti muito valorizada o tempo inteiro como cliente. Brilhantes." }
                ];
            }
            setSiteContent(content);
        }
    };

    const saveSiteContent = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('site_content')
            .upsert({ slug: 'landing-page', content: siteContent, updated_at: new Date().toISOString() });

        if (error) alert("Erro ao salvar: " + error.message);
        else alert("Site atualizado com sucesso!");
        setIsSaving(false);
    };

    const updateSection = (section: string, data: any) => {
        setSiteContent((prev: any) => ({ ...prev, [section]: data }));
    };

    const removeSuccessStory = (idx: number) => {
        const current = [...(siteContent.success_stories || [])];
        current.splice(idx, 1);
        updateSection('success_stories', current);
    };

    const restoreOriginalTestimonials = () => {
        if (!confirm("Isso irá substituir os depoimentos atuais pelos 10 originais. Tem certeza?")) return;
        updateSection('success_stories', [
            { name: "Marcelo Linhares", profession: "CEO", link: "#", comment: "A Cactus Creative entregou muito mais que um site; eles reestruturaram a nossa comunicação digital inteira. O trato que a equipe nos deu foi excepcional do primeiro dia até a entrega, que por sinal ficou impecável." },
            { name: "Camila Rodrigues", profession: "Diretora de Marketing", link: "#", comment: "Profissionalismo puro. O processo deles é super transparente, toda quarta-feira sabíamos exatamente em que pé estava o projeto. O resultado final nos trouxe enorme crescimento de leads." },
            { name: "Fernando Souza", profession: "CTO", link: "#", comment: "A Cactus Creative pegou um problema técnico gigante nosso e transformou numa plataforma fluida e rápida. A paciência e clareza com que trataram nosso time foi um grande diferencial!" },
            { name: "Letícia Monteiro", profession: "Founder", link: "#", comment: "Contratar a Cactus foi a melhor decisão pro nosso reposicionamento. A identidade e a interface refletem a alma do negócio. O atendimento deles? Parece que eles fazem parte da sua própria empresa." },
            { name: "Roberto Farias", profession: "Head of Growth", link: "#", comment: "Não é só código e design, é estratégia pura. Mergulharam no briefing e entregaram uma máquina de vendas. Sem falar no acolhimento de toda a equipe que esteve lado a lado." },
            { name: "Heloísa Becker", profession: "Product Manager", link: "#", comment: "O que mais me surpreendeu na Cactus Creative foi o absoluto rigor com qualidade, prazos e o cuidado impecável na comunicação de todo o time." },
            { name: "Diego Ferreira", profession: "Co-fundador", link: "#", comment: "Transformaram uma ideia extremamente abstrata num portal robusto e lindíssimo em tempo recorde. A capacidade técnica junto ao excelente atendimento faz deles um parceiro vitalício." },
            { name: "Carolina Mattos", profession: "Ops Manager", link: "#", comment: "Impecável. Todo o fluxo de aprovação e desenvolvimento do nosso app foi guiado com uma maestria que você só encontra nas maiores agências do mundo. Recomendo sempre." },
            { name: "Ricardo Almeida", profession: "Tech Lead", link: "#", comment: "Agência que não te abandona pós-deploy. A Cactus Creative nos abraçou de um jeito que poucos fazem. Estabilidade, design primoroso e muito suporte humano ao longo das sprints." },
            { name: "Juliana Silva", profession: "Diretora Operacional", link: "#", comment: "A clareza técnica e o cuidado estético deles são difíceis de encontrar num lugar só. Todo o projeto rodou sem dores de cabeça, me senti muito valorizada o tempo inteiro como cliente. Brilhantes." }
        ]);
        toast.success("10 depoimentos restaurados!");
    };

    const restoreOriginalCapabilities = () => {
        if (!confirm("Isso irá substituir os serviços atuais pelos originais do sistema. Tem certeza?")) return;
        updateSection('capabilities', [
            {
                tag: "ASSINATURA MENSAL",
                tag_en: "MONTHLY SUBSCRIPTION",
                tag_color: "neutral",
                title: "TECH PARTNER (SUSTENTAÇÃO)",
                text: "Atuação como seu braço tecnológico dedicado. Evolução constante, segurança blindada e suporte estratégico para seu negócio nunca parar de crescer.",
                title_en: "TECH PARTNER (SUPPORT)",
                text_en: "Acting as your dedicated technological arm. Constant evolution, ironclad security, and strategic support to keep your business growing."
            },
            {
                tag: "DISPONÍVEL",
                tag_en: "AVAILABLE",
                tag_color: "primary",
                title: "SITES & LANDING PAGES",
                text: "Páginas institucionais e de vendas com estética ultra-premium e foco total em conversão. Sua melhor vitrine digital.",
                title_en: "SITES & LANDING PAGES",
                text_en: "Institutional and sales pages with ultra-premium aesthetics and total focus on conversion. Your best digital storefront."
            },
            {
                tag: "EM DESENVOLVIMENTO",
                tag_en: "IN DEVELOPMENT",
                tag_color: "yellow",
                title: "WEB APPS & SISTEMAS",
                text: "Engenharia de software personalizada. Dashboards, CRMs e plataformas complexas que automatizam e gerenciam seu negócio com maestria.",
                title_en: "WEB APPS & SYSTEMS",
                text_en: "Custom software engineering. Dashboards, CRMs, and complex platforms that automate and manage your business with mastery."
            },
            {
                tag: "DISPONÍVEL",
                tag_en: "AVAILABLE",
                tag_color: "primary",
                title: "APRESENTAÇÕES DE IMPACTO",
                text: "Design estratégico para apresentações comerciais e institucionais. Transformamos dados e argumentos em narrativas visuais que fecham negócios.",
                title_en: "IMPACT PRESENTATIONS",
                text_en: "Strategic design for commercial and institutional presentations. We transform data and arguments into visual narratives that close deals."
            },
            {
                tag: "DISPONÍVEL",
                tag_en: "AVAILABLE",
                tag_color: "primary",
                title: "MÍDIAS SOCIAIS & DESIGN",
                text: "Direção de arte e estratégia de conteúdo para redes sociais. Construímos autoridade visual e conexão real com sua audiência.",
                title_en: "SOCIAL MEDIA & DESIGN",
                text_en: "Art direction and content strategy for social networks. We build visual authority and real connection with your audience."
            },
            {
                tag: "EM DESENVOLVIMENTO",
                tag_en: "IN DEVELOPMENT",
                tag_color: "yellow",
                title: "AUTOMAÇÃO & IA APLICADA",
                text: "Implementamos inteligência artificial para eliminar gargalos operacionais e escalar seu ROI através de processos automatizados.",
                title_en: "AUTOMATION & APPLIED AI",
                text_en: "We implement artificial intelligence to eliminate operational bottlenecks and scale your ROI through automated processes."
            }
        ]);
        toast.success("Serviços originais restaurados e prontos para salvar!");
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex flex-col gap-2">
                <button
                    onClick={() => setActiveTab('clients')}
                    className={`flex items-center gap-4 px-6 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all ${activeTab === 'clients' ? 'bg-primary text-black' : 'bg-surface-container-high text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Users size={16} />
                    {t.Portal.admin_clients}
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center gap-4 px-6 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all ${activeTab === 'projects' ? 'bg-primary text-black' : 'bg-surface-container-high text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Layers size={16} />
                    {t.Portal.admin_projects}
                </button>
                <button
                    onClick={() => setActiveTab('customization')}
                    className={`flex items-center gap-4 px-6 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all ${activeTab === 'customization' ? 'bg-primary text-black' : 'bg-surface-container-high text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Settings size={16} />
                    {t.Portal.admin_customization}
                </button>

            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto max-h-[calc(100vh-100px)] pr-4 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'clients' && (
                        <motion.div
                            key="clients"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-white uppercase">GESTÃO DE CLIENTES</h2>
                                    <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mt-1">Visualize e edite os perfis dos seus parceiros</p>
                                </div>
                                <button className="bg-primary text-black px-6 py-4 font-black text-[10px] tracking-widest uppercase hover:bg-white transition-all">
                                    ADICIONAR CLIENTE
                                </button>
                            </div>

                            {/* Clients Table/Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                {clients.length > 0 ? clients.map((client) => (
                                    <div key={client.id} className={`bg-surface-container-high border ${expandedClient === client.id ? 'border-primary' : 'border-white/5'} p-6 transition-all group`}>
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleClientExpand(client.id)}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-background border border-white/10 flex items-center justify-center font-black text-primary uppercase">
                                                    {client.full_name?.substring(0, 2) || 'CL'}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-white uppercase tracking-tighter text-lg">{client.full_name || 'Sem Nome'}</h4>
                                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{client.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-6 items-center">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[8px] font-black text-neutral-600 uppercase">STATUS</p>
                                                    <p className="text-xs font-bold text-white tracking-widest uppercase">{clientData[client.id]?.projects?.length > 0 ? 'ATIVO' : 'INATIVO'}</p>
                                                </div>
                                                <ChevronRight className={`text-neutral-700 group-hover:text-primary transition-transform ${expandedClient === client.id ? 'rotate-90 text-primary' : ''}`} />
                                            </div>
                                        </div>

                                        {expandedClient === client.id && (
                                            <div className="mt-8 pt-8 border-t border-white/5 space-y-12 animate-in fade-in slide-in-from-top-4">

                                                {/* SECTION 1: DADOS DO CLIENTE */}
                                                <div>
                                                    <h5 className="text-[10px] uppercase font-black text-primary tracking-widest mb-6 flex items-center gap-2">
                                                        <span className="w-1 h-3 bg-primary inline-block"></span>
                                                        DADOS DO CLIENTE
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NOME / EMPRESA</label>
                                                            <input id={`client-name-${client.id}`} defaultValue={client.full_name} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">E-MAIL</label>
                                                            <input id={`client-email-${client.id}`} defaultValue={client.email} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">TELEFONE</label>
                                                            <input id={`client-phone-${client.id}`} defaultValue={client.phone || ''} placeholder="N/A" className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NOVA SENHA</label>
                                                            <input id={`client-pwd-${client.id}`} type="password" placeholder="Em branco para manter" className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors placeholder:text-neutral-700" />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end mt-4">
                                                        <button
                                                            onClick={() => saveClientData(client.id)}
                                                            className="bg-primary/5 border border-primary/20 text-primary px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-black transition-all"
                                                        >
                                                            SALVAR ALTERAÇÕES
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* SECTION 2: PROJETOS ATIVOS */}
                                                <div>
                                                    <h5 className="text-[10px] uppercase font-black text-primary tracking-widest mb-6 flex items-center gap-2">
                                                        <span className="w-1 h-3 bg-primary inline-block"></span>
                                                        PROJETOS E STATUS
                                                    </h5>
                                                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                                        {clientData[client.id]?.projects?.length > 0 ? clientData[client.id].projects.map((proj: any) => (
                                                            <div key={proj.id} className="min-w-[320px] bg-background border border-white/5 p-6 shrink-0 relative group hover:border-primary/50 transition-colors">
                                                                <span className="absolute top-0 right-0 bg-primary/10 text-primary border-b border-l border-primary/20 text-[8px] font-black px-3 py-1 uppercase tracking-widest">
                                                                    {proj.status}
                                                                </span>
                                                                <h6 className="font-black text-white uppercase text-sm mb-1 pr-16 truncate">{proj.name}</h6>
                                                                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-8 line-clamp-2">{proj.description}</p>

                                                                <div className="flex items-center justify-between mt-auto">
                                                                    <div className="flex-1 mr-4">
                                                                        <div className="h-[2px] w-full bg-white/5 rounded-none overflow-hidden relative">
                                                                            <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000" style={{ width: `${proj.current_step}%` }}></div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[10px] text-white font-bold tracking-widest">PROGRESSO: {proj.current_step}%</span>
                                                                </div>

                                                                <button
                                                                    onClick={() => { setActiveTab('projects'); setExpandedProject(proj.id); }}
                                                                    className="w-full mt-6 bg-white/5 border border-white/10 text-white py-3 text-[8px] font-black tracking-widest uppercase hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <Edit size={12} /> GERENCIAR ESTE PROJETO
                                                                </button>
                                                            </div>
                                                        )) : (
                                                            <p className="text-[10px] text-neutral-600 uppercase font-black tracking-widest py-4 border border-dashed border-white/10 w-full text-center">NENHUM PROJETO ENCONTRADO</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* SECTION 3: COMUNICAÇÃO E ARQUIVOS */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="flex justify-between items-center mb-6">
                                                            <h5 className="text-[10px] uppercase font-black text-primary tracking-widest flex items-center gap-2">
                                                                <span className="w-1 h-3 bg-primary inline-block"></span>
                                                                ARQUIVOS DO PROJETO
                                                            </h5>
                                                            <label className="cursor-pointer bg-primary/10 text-primary p-2 hover:bg-primary hover:text-black transition-all">
                                                                <Plus size={14} />
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const pid = clientData[client.id]?.activeProjectId;
                                                                        if (pid) handleAttachmentUpload(e, pid, client.id);
                                                                        else toast.error("Selecione um projeto primeiro");
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="bg-background border border-white/5 p-4 space-y-2 h-[280px] overflow-y-auto custom-scrollbar">
                                                            {clientData[client.id]?.attachments?.filter((a: any) => a.project_id === clientData[client.id]?.activeProjectId).length > 0 ?
                                                                clientData[client.id].attachments.filter((a: any) => a.project_id === clientData[client.id]?.activeProjectId).map((file: any) => (
                                                                    <div key={file.id} className="flex justify-between items-center group p-3 border border-white/5 hover:border-primary/30 hover:bg-white/[0.02] transition-colors">
                                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                                            <FileText size={14} className="text-neutral-500" />
                                                                            <span className="text-[10px] text-neutral-300 uppercase font-bold truncate tracking-widest">{file.name}</span>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary transition-colors">
                                                                                <Download size={14} />
                                                                            </a>
                                                                            <button onClick={() => deleteAttachment(file, client.id)} className="text-neutral-600 hover:text-red-500 transition-colors">
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )) : (
                                                                    <div className="h-full flex flex-col items-center justify-center">
                                                                        <AlertCircle className="text-neutral-800 w-8 h-8 mb-2" />
                                                                        <p className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">NENHUM ARQUIVO PARA ESTE PROJETO</p>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-[10px] uppercase font-black text-primary tracking-widest mb-6 flex items-center gap-2">
                                                            <span className="w-1 h-3 bg-primary inline-block"></span>
                                                            DADOS DO CLIENTE
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">EMAIL</label>
                                                                <div className="bg-background border border-white/5 p-3 text-neutral-400 font-bold text-[10px] uppercase">{client.email}</div>
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">CLIENTE DESDE</label>
                                                                <div className="bg-background border border-white/5 p-3 text-neutral-400 font-bold text-[10px] uppercase">{new Date(client.created_at).toLocaleDateString()}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-neutral-500 text-[10px] font-black uppercase tracking-widest bg-surface-container-high border border-white/5">
                                        NENHUM CLIENTE CADASTRADO.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'projects' && (
                        <motion.div
                            key="projects"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-white uppercase">CENTRO DE PROJETOS</h2>
                                    <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mt-1">Controle o status e progresso de cada entrega</p>
                                </div>
                                <button
                                    onClick={() => setIsCreatingProject(!isCreatingProject)}
                                    className="bg-primary text-black px-6 py-4 font-black text-[10px] tracking-widest uppercase hover:bg-white transition-all"
                                >
                                    {isCreatingProject ? 'CANCELAR' : 'NOVO PROJETO'}
                                </button>
                            </div>

                            {isCreatingProject ? (
                                <div className="bg-surface-container-high border border-white/5 p-8 animate-in fade-in slide-in-from-top-4">
                                    <h5 className="text-[10px] uppercase font-black text-primary tracking-widest mb-6 flex items-center gap-2">
                                        <span className="w-1 h-3 bg-primary inline-block"></span>
                                        CRIAR NOVO PROJETO
                                    </h5>
                                    <form onSubmit={handleCreateProject} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NOME DO PROJETO</label>
                                                <input name="name" required placeholder="Ex: Landing Page Tech" className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                            </div>
                                            <div>
                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">CLIENTE RESPONSÁVEL</label>
                                                <select name="client_id" required className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors appearance-none">
                                                    <option value="" disabled selected>SELECIONE UM CLIENTE</option>
                                                    {clients.map(c => (
                                                        <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">DESCRIÇÃO RÁPIDA</label>
                                                <textarea name="description" rows={3} placeholder="Descreva os objetivos principais..." className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors resize-none custom-scrollbar" />
                                            </div>
                                            <div>
                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">STATUS</label>
                                                <select name="status" className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors appearance-none">
                                                    <option value="Briefing & Estratégia">BRIEFING & ESTRATÉGIA</option>
                                                    <option value="UX UI Design">UX UI DESIGN</option>
                                                    <option value="Produção">PRODUÇÃO</option>
                                                    <option value="Desenvolvimento Backend">DESENVOLVIMENTO BACKEND</option>
                                                    <option value="QA & Bug Testing">QA & BUG TESTING</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button type="submit" className="bg-primary text-black px-8 py-4 text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2">
                                                SALVAR PROJETO <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {allProjects.length > 0 ? allProjects.map((proj) => (
                                        <div key={proj.id} className="bg-surface-container-high border border-white/5 p-6 group">
                                            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-background border border-white/10 flex items-center justify-center font-black text-primary uppercase relative">
                                                        <Layers className="w-5 h-5 opacity-50" />
                                                        {proj.is_new && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white uppercase tracking-tighter text-lg">{proj.name}</h4>
                                                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                                                            {clients.find(c => c.id === proj.client_id)?.full_name || 'CLIENTE NÃO ENCONTRADO'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 items-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }}
                                                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                        title="Excluir Projeto"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="text-right hidden md:block">
                                                        <p className="text-[8px] font-black text-neutral-600 uppercase">STATUS</p>
                                                        <p className="text-xs font-bold text-primary tracking-widest uppercase">{proj.status}</p>
                                                    </div>
                                                    <ChevronRight className={`text-neutral-700 group-hover:text-primary transition-transform ${expandedProject === proj.id ? 'rotate-90 text-primary' : ''}`} />
                                                </div>
                                            </div>

                                            {expandedProject === proj.id && (
                                                <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 space-y-8">
                                                    <div>
                                                        <h5 className="text-[10px] uppercase font-black text-primary tracking-widest mb-6 flex items-center gap-2">
                                                            <span className="w-1 h-3 bg-primary inline-block"></span>
                                                            CONTROLES DO PROJETO
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="md:col-span-1">
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">STATUS DO PROJETO</label>
                                                                <select id={`proj-status-${proj.id}`} defaultValue={proj.status} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors appearance-none">
                                                                    <option value="Briefing & Estratégia">BRIEFING & ESTRATÉGIA</option>
                                                                    <option value="UX UI Design">UX UI DESIGN</option>
                                                                    <option value="Produção">PRODUÇÃO</option>
                                                                    <option value="Desenvolvimento Backend">DESENVOLVIMENTO BACKEND</option>
                                                                    <option value="QA & Bug Testing">QA & BUG TESTING</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">PORCENTAGEM DO PROJETO (%)</label>
                                                                <input id={`proj-step-${proj.id}`} type="number" min="0" max="100" defaultValue={proj.current_step} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">LINK DE PRODUÇÃO / URL</label>
                                                                <input id={`proj-link-${proj.id}`} defaultValue={proj.production_link || ''} placeholder="https://..." className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NOME DO PROJETO</label>
                                                                <input id={`proj-name-${proj.id}`} defaultValue={proj.name} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                            <div className="md:col-span-1">
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">AÇÕES CRÍTICAS</label>
                                                                <button onClick={() => deleteProject(proj.id)} className="w-full bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                                                    <Trash2 size={14} /> EXCLUIR PROJETO
                                                                </button>
                                                            </div>
                                                            <div className="md:col-span-3">
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">DESCRIÇÃO DO PROJETO</label>
                                                                <textarea id={`proj-desc-${proj.id}`} defaultValue={proj.description} rows={3} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors resize-none custom-scrollbar" />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end mt-4">
                                                            <button
                                                                onClick={() => saveProjectData(proj.id)}
                                                                className="bg-primary/5 border border-primary/20 text-primary px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-black transition-all"
                                                            >
                                                                SALVAR ALTERAÇÕES DESSA ABA
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 border-t border-white/5 pt-8">
                                                        {/* COLUNA: ARQUIVOS */}
                                                        <div className="lg:col-span-4 space-y-4">
                                                            <h5 className="text-[10px] uppercase font-black text-primary tracking-[0.3em] flex items-center gap-2">
                                                                <span className="w-1 h-3 bg-primary inline-block"></span>
                                                                ARQUIVOS DO PROJETO
                                                            </h5>
                                                            <div className="bg-surface-container-high/40 border border-white/5 p-4 h-[320px] overflow-y-auto custom-scrollbar">
                                                                {clientData[proj.client_id]?.attachments?.filter((a: any) => a.project_id === proj.id).length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        {clientData[proj.client_id].attachments.filter((a: any) => a.project_id === proj.id).map((file: any) => (
                                                                            <div key={file.id} className="flex justify-between items-center group p-3 bg-background/40 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
                                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                                    <FileText className="w-4 h-4 text-neutral-600 transition-colors shrink-0" />
                                                                                    <span className="text-[10px] text-neutral-400 uppercase font-black truncate tracking-widest group-hover:text-white transition-colors">{file.name}</span>
                                                                                </div>
                                                                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-600 hover:text-primary transition-colors">
                                                                                    <Download className="w-3.5 h-3.5" />
                                                                                </a>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                                                                        <FileText className="w-8 h-8 text-neutral-600 mb-2" />
                                                                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest text-center">NENHUM ARQUIVO AINDA</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* COLUNA: CHAT */}
                                                        <div className="lg:col-span-8 space-y-4">
                                                            <h5 className="text-[10px] uppercase font-black text-primary tracking-[0.3em] flex items-center gap-2">
                                                                <span className="w-1 h-3 bg-primary inline-block"></span>
                                                                MENSAGENS DO PROJETO
                                                            </h5>
                                                            <div className="bg-surface-container-high/40 border border-white/5 flex flex-col h-[320px] relative overflow-hidden">
                                                                {/* Background pattern decorativo sutil */}
                                                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#aed500_1px,transparent_1px)] [background-size:24px_24px]"></div>

                                                                <div
                                                                    id={`chat-scroll-${proj.id}`}
                                                                    className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative z-10"
                                                                >
                                                                    {clientData[proj.client_id]?.messages?.filter((m: any) => m.project_id === proj.id).map((msg: any) => {
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
                                                                                    <span>{isMe ? 'VOCÊ (ADMIN)' : 'CLIENTE'}</span>
                                                                                    <span className="opacity-20">•</span>
                                                                                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {(!clientData[proj.client_id]?.messages?.some((m: any) => m.project_id === proj.id)) && (
                                                                        <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-20">
                                                                            <MessageSquare className="w-10 h-10 text-primary mb-4" />
                                                                            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">SEM HISTÓRICO</p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="p-3 bg-background/40 backdrop-blur-sm border-t border-white/5 relative z-10">
                                                                    <div className="flex gap-2 bg-surface-container-high border border-white/5 p-1 focus-within:border-primary/40 transition-all">
                                                                        <input
                                                                            id={`proj-chat-input-${proj.id}`}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(proj.client_id, proj.id)}
                                                                            placeholder="MENSAGEM PARA ESTE PROJETO..."
                                                                            className="flex-1 bg-transparent px-4 py-3 text-[10px] font-black text-white focus:outline-none placeholder:text-neutral-800 uppercase tracking-widest"
                                                                        />
                                                                        <button
                                                                            onClick={() => handleSendMessage(proj.client_id, proj.id)}
                                                                            className="bg-primary text-black w-12 flex items-center justify-center hover:bg-white transition-all active:scale-95"
                                                                        >
                                                                            <Send size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 text-neutral-500 text-[10px] font-black uppercase tracking-widest bg-surface-container-high border border-white/5">
                                            NENHUM PROJETO CADASTRADO.
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'customization' && (
                        <motion.div
                            key="customization"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full flex flex-col"
                        >
                            {/* Customization Header */}
                            <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-8">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-white uppercase">CUSTOMIZAÇÃO DO SITE</h2>
                                    <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mt-1">Refine a identidade e o conteúdo da sua Landing Page</p>
                                </div>
                                <button
                                    onClick={saveSiteContent}
                                    disabled={isSaving}
                                    className="bg-primary text-black px-10 py-4 font-black text-xs tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(174,213,0,0.2)]"
                                >
                                    {isSaving ? "SALVANDO..." : "PUBLICAR ALTERAÇÕES"}
                                </button>
                            </div>

                            {!siteContent ? (
                                <div className="animate-pulse space-y-8">
                                    <div className="h-40 bg-white/5 rounded-none" />
                                    <div className="h-80 bg-white/5 rounded-none" />
                                </div>
                            ) : (
                                <div className="flex gap-8 items-start">
                                    {/* Sub-menu Lateral */}
                                    <nav className="w-48 flex flex-col gap-1 sticky top-0">
                                        {[
                                            { id: 'general', label: 'GERAL', icon: Layout },
                                            { id: 'capabilities', label: 'SERVIÇOS', icon: CheckSquare },
                                            { id: 'projects', label: 'VITRINE', icon: Layers },
                                            { id: 'stats', label: 'NÚMEROS', icon: BarChart3 },
                                            { id: 'stories', label: 'DEPOIMENTOS', icon: Star },
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveCustomTab(item.id as any)}
                                                className={`flex items-center gap-3 px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all ${activeCustomTab === item.id
                                                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                <item.icon size={14} />
                                                {item.label}
                                            </button>
                                        ))}
                                    </nav>

                                    {/* Área de Edição */}
                                    <div className="flex-1 space-y-12 pb-20">
                                        {activeCustomTab === 'general' && (
                                            <section className="animate-in fade-in slide-in-from-right-4 space-y-12">
                                                <div>
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase mb-8 border-l-2 border-primary pl-4">META TAGS & SEO</h3>
                                                    <div className="bg-surface-container-high border border-white/5 p-8 space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">TÍTULO DA PÁGINA (PT)</label>
                                                                    <input
                                                                        value={siteContent?.general?.meta_title_pt || ''}
                                                                        placeholder="Ex: CactusCreative | Digital Agency"
                                                                        onChange={(e) => updateSection('general', { ...siteContent?.general, meta_title_pt: e.target.value })}
                                                                        className="w-full bg-background border border-white/5 p-3 font-bold text-white text-sm focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">META DESCRIPTION (PT)</label>
                                                                    <textarea
                                                                        value={siteContent?.general?.meta_desc_pt || ''}
                                                                        placeholder="Resumo do que fazemos para aparecer no Google..."
                                                                        onChange={(e) => updateSection('general', { ...siteContent?.general, meta_desc_pt: e.target.value })}
                                                                        className="w-full h-24 bg-background border border-white/5 p-3 font-body text-white text-sm focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="text-[8px] font-black text-blue-400/60 uppercase mb-2 block tracking-widest">TÍTULO DA PÁGINA (EN)</label>
                                                                    <input
                                                                        value={siteContent?.general?.meta_title_en || ''}
                                                                        placeholder="Ex: CactusCreative | Digital Agency"
                                                                        onChange={(e) => updateSection('general', { ...siteContent?.general, meta_title_en: e.target.value })}
                                                                        className="w-full bg-background border border-white/5 p-3 font-bold text-blue-400/60 text-sm focus:border-blue-400/40 focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[8px] font-black text-blue-400/60 uppercase mb-2 block tracking-widest">META DESCRIPTION (EN)</label>
                                                                    <textarea
                                                                        value={siteContent?.general?.meta_desc_en || ''}
                                                                        placeholder="Summary of what we do in English..."
                                                                        onChange={(e) => updateSection('general', { ...siteContent?.general, meta_desc_en: e.target.value })}
                                                                        className="w-full h-24 bg-background border border-white/5 p-3 font-body text-blue-400/60 text-sm focus:border-blue-400/40 focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase mb-8 border-l-2 border-primary pl-4">COMPARTILHAMENTO (OPEN GRAPH)</h3>
                                                    <div className="bg-surface-container-high border border-white/5 p-8 flex gap-8 items-center">
                                                        <div className="relative w-48 h-28 bg-background border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                                            {siteContent?.general?.og_image ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img src={siteContent.general.og_image} alt="OG Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-[10px] text-neutral-600 font-bold tracking-widest uppercase">Sem Imagem</span>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleOGImageUpload}
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white mb-2">Imagem Oficial de Preview</h4>
                                                            <p className="text-xs text-neutral-400 font-body mb-4 leading-relaxed">
                                                                Esta imagem aparecerá quando o site for linkado no WhatsApp, LinkedIn, X, etc. Recomendado: 1200x630px.
                                                            </p>
                                                            <button className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase border border-primary/20 px-4 py-2 hover:bg-primary/10 transition-all pointer-events-none">
                                                                <Plus size={12} /> ALTERAR IMAGEM
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase mb-8 border-l-2 border-primary pl-4">INJEÇÃO DE TRACKING (ANALYTICS & PIXEL)</h3>
                                                    <div className="bg-surface-container-high border border-white/5 p-8 space-y-6">
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">SCRIPTS NO <code>&lt;head&gt;</code></label>
                                                            <textarea
                                                                value={siteContent?.general?.tracking_head || ''}
                                                                placeholder="Cole aqui o seu Google Analytics (gtag), Meta Pixel, ou GTM..."
                                                                onChange={(e) => updateSection('general', { ...siteContent?.general, tracking_head: e.target.value })}
                                                                className="w-full h-32 bg-[#0a0a0a] border border-white/5 p-4 font-mono text-[10px] text-primary/80 focus:border-primary focus:outline-none transition-all placeholder:text-neutral-700"
                                                            />
                                                            <p className="text-[9px] text-neutral-500 mt-2 font-bold">ATENÇÃO: Inclua as tags &lt;script&gt; e &lt;/script&gt; completas.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeCustomTab === 'capabilities' && (
                                            <section className="animate-in fade-in slide-in-from-right-4">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase border-l-2 border-primary pl-4">NOSSOS SERVIÇOS (CARDS)</h3>
                                                    <button
                                                        onClick={restoreOriginalCapabilities}
                                                        className="flex items-center gap-2 text-[9px] font-black tracking-widest text-neutral-400 hover:text-white transition-all bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10"
                                                    >
                                                        <Sparkles size={12} className="text-primary" /> Restaurar Originais
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-6">
                                                    {siteContent.capabilities.map((cap: any, idx: number) => (
                                                        <div key={idx} className="bg-surface-container-high border border-white/5 p-8 space-y-6 group hover:border-primary/20 transition-all">
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                                                    <div className="flex-1">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">TAG DO CARD (PT)</label>
                                                                        <input
                                                                            value={cap.tag}
                                                                            onChange={(e) => {
                                                                                const newCaps = [...siteContent.capabilities];
                                                                                newCaps[idx].tag = e.target.value;
                                                                                updateSection('capabilities', newCaps);
                                                                            }}
                                                                            className="w-full bg-primary/5 text-primary text-[10px] font-black tracking-widest border border-primary/20 p-2 focus:outline-none uppercase focus:bg-primary/10 transition-all"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <label className="text-[8px] font-black text-blue-400/60 uppercase mb-2 block tracking-widest">TAG DO CARD (EN)</label>
                                                                        <input
                                                                            value={cap.tag_en || ''}
                                                                            placeholder="English tag..."
                                                                            onChange={(e) => {
                                                                                const newCaps = [...siteContent.capabilities];
                                                                                newCaps[idx].tag_en = e.target.value;
                                                                                updateSection('capabilities', newCaps);
                                                                            }}
                                                                            className="w-full bg-blue-400/5 text-blue-400 border border-blue-400/20 p-2 text-[10px] font-black tracking-widest uppercase focus:bg-blue-400/10 focus:outline-none transition-all placeholder:text-blue-900"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 max-w-[150px]">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">COR DA TAG</label>
                                                                        <select
                                                                            value={cap.tag_color || 'primary'}
                                                                            onChange={(e) => {
                                                                                const newCaps = [...siteContent.capabilities];
                                                                                newCaps[idx].tag_color = e.target.value;
                                                                                updateSection('capabilities', newCaps);
                                                                            }}
                                                                            className="w-full bg-background text-white border border-white/5 p-2 text-[10px] font-black tracking-widest uppercase focus:border-primary focus:outline-none transition-all"
                                                                        >
                                                                            <option value="primary">Cactus Green</option>
                                                                            <option value="yellow">Yellow</option>
                                                                            <option value="neutral">Neutral White</option>
                                                                            <option value="blue">Blue</option>
                                                                            <option value="red">Red</option>
                                                                        </select>
                                                                    </div>
                                                                    <span className="text-[10px] text-neutral-800 font-black tracking-tighter mt-6 md:mt-0 md:ml-4 self-center">#[{idx + 1}]</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">TÍTULO DO SERVIÇO (PT)</label>
                                                                <input
                                                                    value={cap.title}
                                                                    onChange={(e) => {
                                                                        const newCaps = [...siteContent.capabilities];
                                                                        newCaps[idx].title = e.target.value;
                                                                        updateSection('capabilities', newCaps);
                                                                    }}
                                                                    className="w-full bg-background border border-white/5 p-3 font-black text-white uppercase text-sm tracking-tighter focus:border-primary focus:outline-none transition-all"
                                                                />
                                                                <label className="text-[8px] font-black text-blue-400/60 uppercase mt-4 mb-2 block tracking-widest">TÍTULO DO SERVIÇO (EN)</label>
                                                                <input
                                                                    value={cap.title_en || ''}
                                                                    placeholder="English title..."
                                                                    onChange={(e) => {
                                                                        const newCaps = [...siteContent.capabilities];
                                                                        newCaps[idx].title_en = e.target.value;
                                                                        updateSection('capabilities', newCaps);
                                                                    }}
                                                                    className="w-full bg-background border border-white/5 p-3 font-black text-blue-400/60 uppercase text-sm tracking-tighter focus:border-blue-400/40 focus:outline-none transition-all placeholder:text-neutral-800"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">DESCRIÇÃO DETALHADA (PT)</label>
                                                                <textarea
                                                                    value={cap.text}
                                                                    onChange={(e) => {
                                                                        const newCaps = [...siteContent.capabilities];
                                                                        newCaps[idx].text = e.target.value;
                                                                        updateSection('capabilities', newCaps);
                                                                    }}
                                                                    className="w-full bg-background border border-white/5 p-4 text-[12px] text-neutral-400 font-medium leading-relaxed focus:border-primary focus:outline-none custom-scrollbar resize-none transition-all"
                                                                    rows={3}
                                                                />
                                                                <label className="text-[8px] font-black text-blue-400/60 uppercase mt-4 mb-2 block tracking-widest">DESCRIÇÃO DETALHADA (EN)</label>
                                                                <textarea
                                                                    value={cap.text_en || ''}
                                                                    placeholder="English description..."
                                                                    onChange={(e) => {
                                                                        const newCaps = [...siteContent.capabilities];
                                                                        newCaps[idx].text_en = e.target.value;
                                                                        updateSection('capabilities', newCaps);
                                                                    }}
                                                                    className="w-full bg-background border border-white/5 p-4 text-[12px] text-blue-400/60 font-medium leading-relaxed focus:border-blue-400/40 focus:outline-none custom-scrollbar resize-none transition-all placeholder:text-neutral-800"
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {activeCustomTab === 'projects' && (
                                            <section className="animate-in fade-in slide-in-from-right-4">
                                                <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase mb-8 border-l-2 border-primary pl-4">VITRINE DE PROJETOS SELECIONADOS</h3>
                                                <div className="space-y-12">
                                                    {siteContent.featured_projects.map((proj: any, idx: number) => (
                                                        <div key={idx} className="bg-surface-container-high border border-white/5 p-8 space-y-8 relative group hover:border-primary/20 transition-all">
                                                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-8 h-8 bg-primary/10 flex items-center justify-center font-black text-primary text-[10px]">{idx + 1}</div>
                                                                    {proj.image && (
                                                                        <div className="w-10 h-10 border border-white/10 overflow-hidden bg-black shrink-0 animate-in fade-in zoom-in">
                                                                            <img src={proj.image} className="w-full h-full object-cover" alt="" />
                                                                        </div>
                                                                    )}
                                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{proj.title || "PROJETO SEM TÍTULO"}</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            const newProjs = siteContent.featured_projects.filter((_: any, i: number) => i !== idx);
                                                                            updateSection('featured_projects', newProjs);
                                                                        }}
                                                                        className="p-2 text-neutral-700 hover:text-red-500 transition-all"
                                                                        title="Remover Projeto"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                                {/* Coluna Esquerda: Definições e Links */}
                                                                <div className="space-y-6">
                                                                    <div>
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">TÍTULO DO PROJETO</label>
                                                                        <input
                                                                            value={proj.title}
                                                                            onChange={(e) => {
                                                                                const newProjs = [...siteContent.featured_projects];
                                                                                newProjs[idx].title = e.target.value;
                                                                                updateSection('featured_projects', newProjs);
                                                                            }}
                                                                            className="w-full bg-background border border-white/5 p-3 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                        />
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">CATEGORIA / CONTEXTO</label>
                                                                            <input
                                                                                value={proj.category}
                                                                                onChange={(e) => {
                                                                                    const newProjs = [...siteContent.featured_projects];
                                                                                    newProjs[idx].category = e.target.value;
                                                                                    updateSection('featured_projects', newProjs);
                                                                                }}
                                                                                className="w-full bg-background border border-white/5 p-3 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">LINK DO PROJETO (URL)</label>
                                                                            <input
                                                                                value={proj.url || ''}
                                                                                onChange={(e) => {
                                                                                    const newProjs = [...siteContent.featured_projects];
                                                                                    newProjs[idx].url = e.target.value;
                                                                                    updateSection('featured_projects', newProjs);
                                                                                }}
                                                                                placeholder="https://..."
                                                                                className="w-full bg-background border border-white/5 p-3 text-white text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">URL DA IMAGEM PRINCIPAL</label>
                                                                        <div className="flex gap-2">
                                                                            <input
                                                                                value={proj.image}
                                                                                onChange={(e) => {
                                                                                    const newProjs = [...siteContent.featured_projects];
                                                                                    newProjs[idx].image = e.target.value;
                                                                                    updateSection('featured_projects', newProjs);
                                                                                }}
                                                                                className="flex-1 bg-background border border-white/5 p-3 text-white text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                            />
                                                                            <label className="bg-primary/10 text-primary border border-primary/20 px-4 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-black transition-all group/up">
                                                                                {uploadingImage === idx ? (
                                                                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                                                ) : (
                                                                                    <Download className="w-4 h-4 rotate-180" />
                                                                                )}
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    className="hidden"
                                                                                    onChange={(e) => handleImageUpload(e, idx)}
                                                                                    disabled={uploadingImage === idx}
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                        {proj.image && (
                                                                            <div className="mt-3 relative w-full h-[140px] bg-black border border-white/5 overflow-hidden group/img">
                                                                                <img src={proj.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Coluna Direita: Conteúdo e Tags */}
                                                                <div className="space-y-6">
                                                                    <div>
                                                                        <div className="flex justify-between items-end mb-2">
                                                                            <label className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">DESCRIÇÃO DO PROJETO</label>
                                                                            <button
                                                                                onClick={() => handleGenerateAIDescription(idx)}
                                                                                disabled={isGeneratingAI === idx || !proj.image}
                                                                                className="flex items-center gap-2 text-[9px] font-black text-primary hover:text-white transition-all disabled:opacity-30"
                                                                            >
                                                                                {isGeneratingAI === idx ? (
                                                                                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                                                ) : (
                                                                                    <Sparkles size={12} />
                                                                                )}
                                                                                GERAR COM IA
                                                                            </button>
                                                                        </div>
                                                                        <textarea
                                                                            value={proj.description}
                                                                            onChange={(e) => {
                                                                                const newProjs = [...siteContent.featured_projects];
                                                                                newProjs[idx].description = e.target.value;
                                                                                updateSection('featured_projects', newProjs);
                                                                            }}
                                                                            className="w-full bg-background border border-white/5 p-4 text-[11px] text-neutral-400 font-medium leading-relaxed focus:border-primary focus:outline-none transition-all resize-none"
                                                                            rows={4}
                                                                            placeholder="Descreva o projeto aqui (PT)..."
                                                                        />
                                                                        <div className="mt-2">
                                                                            <label className="text-[8px] font-black text-blue-400/60 uppercase mb-2 block tracking-widest">DESCRIÇÃO (EN)</label>
                                                                            <textarea
                                                                                value={proj.description_en || ''}
                                                                                onChange={(e) => {
                                                                                    const newProjs = [...siteContent.featured_projects];
                                                                                    newProjs[idx].description_en = e.target.value;
                                                                                    updateSection('featured_projects', newProjs);
                                                                                }}
                                                                                className="w-full bg-background border border-white/5 p-4 text-[11px] text-blue-400/60 font-medium leading-relaxed focus:border-blue-400/40 focus:outline-none transition-all resize-none placeholder:text-neutral-800"
                                                                                rows={4}
                                                                                placeholder="Project description in English..."
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-3 block tracking-widest">HASHTAGS (ENTER PARA ADICIONAR)</label>
                                                                        <div className="bg-background border border-white/5 p-3 flex flex-wrap gap-2 min-h-[90px] content-start focus-within:border-primary/40 transition-all">
                                                                            {proj.tags.map((tag: string, tIdx: number) => (
                                                                                <span key={tIdx} className="bg-primary text-black px-3 py-1 text-[8px] font-black flex items-center gap-2 animate-in zoom-in-50">
                                                                                    {tag}
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const newTags = proj.tags.filter((_: any, i: number) => i !== tIdx);
                                                                                            const newProjs = [...siteContent.featured_projects];
                                                                                            newProjs[idx].tags = newTags;
                                                                                            updateSection('featured_projects', newProjs);
                                                                                        }}
                                                                                        className="hover:scale-125 transition-transform"
                                                                                    >
                                                                                        <X size={10} />
                                                                                    </button>
                                                                                </span>
                                                                            ))}
                                                                            <input
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        const val = (e.target as HTMLInputElement).value.trim().toUpperCase();
                                                                                        if (val && !proj.tags.includes(val)) {
                                                                                            const newProjs = [...siteContent.featured_projects];
                                                                                            newProjs[idx].tags = [...proj.tags, val];
                                                                                            updateSection('featured_projects', newProjs);
                                                                                            (e.target as HTMLInputElement).value = '';
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                placeholder={proj.tags.length === 0 ? "EX: DESIGN, BRANDING..." : ""}
                                                                                className="flex-1 bg-transparent border-none text-[10px] font-bold text-white focus:outline-none uppercase min-w-[100px]"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-8">
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">STAT 1 VAL</label>
                                                                    <input
                                                                        value={proj.stat1_val}
                                                                        onChange={(e) => {
                                                                            const newProjs = [...siteContent.featured_projects];
                                                                            newProjs[idx].stat1_val = e.target.value;
                                                                            updateSection('featured_projects', newProjs);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-2 text-primary font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">STAT 1 LABEL (PT)</label>
                                                                    <input
                                                                        value={proj.stat1_label}
                                                                        onChange={(e) => {
                                                                            const newProjs = [...siteContent.featured_projects];
                                                                            newProjs[idx].stat1_label = e.target.value;
                                                                            updateSection('featured_projects', newProjs);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-2 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                    <input
                                                                        value={proj.stat1_label_en || ''}
                                                                        placeholder="EN label..."
                                                                        onChange={(e) => {
                                                                            const newProjs = [...siteContent.featured_projects];
                                                                            newProjs[idx].stat1_label_en = e.target.value;
                                                                            updateSection('featured_projects', newProjs);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-2 text-blue-400/60 font-black uppercase text-[10px] focus:border-blue-400/40 focus:outline-none transition-all mt-1 placeholder:text-neutral-800"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">STAT 2 VAL</label>
                                                                    <input
                                                                        value={proj.stat2_val}
                                                                        onChange={(e) => {
                                                                            const newProjs = [...siteContent.featured_projects];
                                                                            newProjs[idx].stat2_val = e.target.value;
                                                                            updateSection('featured_projects', newProjs);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-2 text-primary font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">STAT 2 LABEL (PT)</label>
                                                                    <input
                                                                        value={proj.stat2_label}
                                                                        onChange={(e) => {
                                                                            const newProjs = [...siteContent.featured_projects];
                                                                            newProjs[idx].stat2_label = e.target.value;
                                                                            updateSection('featured_projects', newProjs);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-2 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                    <input
                                                                        value={proj.stat2_label_en || ''}
                                                                        placeholder="EN label..."
                                                                        onChange={(e) => {
                                                                            const newProjs = [...siteContent.featured_projects];
                                                                            newProjs[idx].stat2_label_en = e.target.value;
                                                                            updateSection('featured_projects', newProjs);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-2 text-blue-400/60 font-black uppercase text-[10px] focus:border-blue-400/40 focus:outline-none transition-all mt-1 placeholder:text-neutral-800"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => {
                                                            const newProj = {
                                                                index: siteContent.featured_projects.length + 1,
                                                                title: "NOVO PROJETO",
                                                                category: "CATEGORIA",
                                                                image: "",
                                                                description: "",
                                                                tags: [],
                                                                stat1_val: "0%",
                                                                stat1_label: "MÉTRICA",
                                                                stat2_val: "0%",
                                                                stat2_label: "MÉTRICA",
                                                                url: "#"
                                                            };
                                                            updateSection('featured_projects', [...siteContent.featured_projects, newProj]);
                                                        }}
                                                        className="w-full border-2 border-dashed border-white/5 py-10 text-[10px] font-black tracking-[0.4em] text-neutral-600 hover:border-primary hover:text-primary transition-all uppercase flex items-center justify-center gap-4 group"
                                                    >
                                                        <Plus className="group-hover:scale-125 transition-transform" />
                                                        ADICIONAR NOVO PROJETO À VITRINE
                                                    </button>
                                                </div>
                                            </section>
                                        )}

                                        {activeCustomTab === 'stats' && (
                                            <section className="animate-in fade-in slide-in-from-right-4">
                                                <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase mb-8 border-l-2 border-primary pl-4">NÚMEROS E HIGHLIGHTS</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {siteContent.highlights.map((h: any, idx: number) => (
                                                        <div key={idx} className="bg-surface-container-high border border-white/5 p-8 text-center space-y-4 group hover:border-primary/20 transition-all">
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest text-left">VALOR</label>
                                                                <input
                                                                    value={h.val || h.value || ''}
                                                                    onChange={(e) => {
                                                                        const newH = [...siteContent.highlights];
                                                                        newH[idx].val = e.target.value;
                                                                        newH[idx].value = undefined;
                                                                        updateSection('highlights', newH);
                                                                    }}
                                                                    className="w-full bg-transparent text-4xl font-black text-primary text-center focus:outline-none focus:scale-110 transition-transform"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest text-left">DESCRIÇÃO (PT)</label>
                                                                <input
                                                                    value={h.label}
                                                                    onChange={(e) => {
                                                                        const newH = [...siteContent.highlights];
                                                                        newH[idx].label = e.target.value;
                                                                        updateSection('highlights', newH);
                                                                    }}
                                                                    className="w-full bg-transparent text-[10px] font-black text-neutral-500 text-center uppercase tracking-[0.2em] focus:outline-none focus:text-white transition-colors"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest text-left">DESCRIÇÃO (EN)</label>
                                                                <input
                                                                    value={h.label_en || ''}
                                                                    placeholder="English label..."
                                                                    onChange={(e) => {
                                                                        const newH = [...siteContent.highlights];
                                                                        newH[idx].label_en = e.target.value;
                                                                        updateSection('highlights', newH);
                                                                    }}
                                                                    className="w-full bg-transparent text-[10px] font-black text-blue-400/60 text-center uppercase tracking-[0.2em] focus:outline-none focus:text-blue-400 transition-colors placeholder:text-neutral-800"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {activeCustomTab === 'stories' && (
                                            <section className="animate-in fade-in slide-in-from-right-4">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase border-l-2 border-primary pl-4">HISTÓRIAS DE SUCESSO (DEPOIMENTOS)</h3>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={restoreOriginalTestimonials}
                                                            className="border border-white/20 text-neutral-400 px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-all text-center"
                                                        >
                                                            RESTAURAR 10 ORIGINAIS
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newStory = { name: "Novo Cliente", profession: "Cargo", link: "#", comment: "Escreva aqui..." };
                                                                updateSection('success_stories', [newStory, ...(siteContent.success_stories || [])]);
                                                            }}
                                                            className="bg-primary/10 border border-primary/20 text-primary px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-black transition-all flex items-center gap-2"
                                                        >
                                                            <Plus size={14} /> ADICIONAR DEPOIMENTO
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    {(siteContent.success_stories || []).map((story: any, idx: number) => (
                                                        <div key={idx} className="bg-surface-container-high border border-white/5 p-8 space-y-6 group hover:border-primary/20 transition-all relative">
                                                            <div className="absolute top-4 right-4 flex items-center gap-4">
                                                                <span className="text-[10px] font-black text-neutral-800">#{idx + 1}</span>
                                                                <button
                                                                    onClick={() => removeSuccessStory(idx)}
                                                                    title="Remover depoimento"
                                                                    className="text-neutral-500 hover:text-red-500 transition-colors bg-black/20 p-2 border border-white/5 hover:border-red-500/30"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">NOME DO CLIENTE</label>
                                                                    <input
                                                                        value={story.name}
                                                                        onChange={(e) => {
                                                                            const newS = [...siteContent.success_stories];
                                                                            newS[idx].name = e.target.value;
                                                                            updateSection('success_stories', newS);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-3 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">PROFISSÃO / CARGO</label>
                                                                    <input
                                                                        value={story.profession}
                                                                        onChange={(e) => {
                                                                            const newS = [...siteContent.success_stories];
                                                                            newS[idx].profession = e.target.value;
                                                                            updateSection('success_stories', newS);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-3 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">LINK DO PROJETO</label>
                                                                    <input
                                                                        value={story.link}
                                                                        onChange={(e) => {
                                                                            const newS = [...siteContent.success_stories];
                                                                            newS[idx].link = e.target.value;
                                                                            updateSection('success_stories', newS);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-3 text-white text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">DEPOIMENTO / COMENTÁRIO</label>
                                                                <textarea
                                                                    value={story.comment}
                                                                    onChange={(e) => {
                                                                        const newS = [...siteContent.success_stories];
                                                                        newS[idx].comment = e.target.value;
                                                                        updateSection('success_stories', newS);
                                                                    }}
                                                                    className="w-full bg-background border border-white/5 p-4 text-[12px] text-neutral-300 leading-relaxed focus:border-primary focus:outline-none custom-scrollbar resize-none transition-all"
                                                                    rows={4}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <button
                                                        onClick={addSuccessStory}
                                                        className="w-full border-2 border-dashed border-white/5 py-10 text-[10px] font-black tracking-[0.4em] text-neutral-600 hover:border-primary hover:text-primary transition-all uppercase flex items-center justify-center gap-4 group"
                                                    >
                                                        <Plus className="group-hover:scale-125 transition-transform" />
                                                        ADICIONAR NOVA HISTÓRIA DE SUCESSO
                                                    </button>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main >
        </div >
    );
}

