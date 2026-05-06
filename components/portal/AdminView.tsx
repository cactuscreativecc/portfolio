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
    CreditCard,
    Briefcase,
    Layout,
    Star,
    BarChart3,
    CheckSquare
} from "lucide-react";
import { Component as Loader } from "@/components/ui/loader-2";
import { Locale } from "@/i18n-config";
import { toast } from "sonner";

interface AdminViewProps {
    lang: Locale;
    t: any;
    profile: any;
}

type AdminTab = 'clients' | 'projects' | 'customization' | 'briefings';

export default function AdminView({ lang, t, profile }: AdminViewProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('clients');

    // CMS State
    const [siteContent, setSiteContent] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState<number | null>(null);
    const [activeCustomTab, setActiveCustomTab] = useState<'general' | 'capabilities' | 'projects' | 'stats' | 'stories' | 'clients'>('general');
    const [isGeneratingAI, setIsGeneratingAI] = useState<number | null>(null);
    const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});

    // Clients State
    const [clients, setClients] = useState<any[]>([]);
    const [expandedClient, setExpandedClient] = useState<string | null>(null);
    const [clientData, setClientData] = useState<Record<string, any>>({});
    const [isCreatingClient, setIsCreatingClient] = useState(false);
    const updateSection = (section: string, data: any) => {
        setSiteContent((prev: any) => ({ ...prev, [section]: data }));
    };
    const [newClientData, setNewClientData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        document: '', // CPF ou CNPJ
        emergencyContact: '',
        companyName: '',
        cep: '',
        address: {
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            uf: ''
        }
    });

    // Projects State
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [expandedProject, setExpandedProject] = useState<string | null>(null);

    // Briefings State
    const [briefings, setBriefings] = useState<any[]>([]);
    const [expandedBriefing, setExpandedBriefing] = useState<string | null>(null);
    const [isLoadingBriefings, setIsLoadingBriefings] = useState(false);
    const [clientInnerTabs, setClientInnerTabs] = useState<Record<string, 'projects' | 'finance' | 'chat' | 'settings'>>({});
    const [selectedContractProject, setSelectedContractProject] = useState<any>(null);

    const fetchBriefings = async () => {
        setIsLoadingBriefings(true);
        try {
            const { data } = await supabase
                .from('briefings')
                .select('*')
                .order('created_at', { ascending: false });
            setBriefings(data ?? []);
        } catch { /* noop */ } finally {
            setIsLoadingBriefings(false);
        }
    };

    const deleteBriefing = async (id: string) => {
        if (!confirm("TEM CERTEZA QUE DESEJA EXCLUIR ESTE LEAD? ESTA AÇÃO É IRREVERSÍVEL.")) return;

        try {
            const { error } = await supabase.from('briefings').delete().eq('id', id);
            if (error) throw error;

            toast.success('Lead excluído com sucesso.');
            setBriefings(prev => prev.filter(b => b.id !== id));
            if (expandedBriefing === id) setExpandedBriefing(null);
        } catch (err: any) {
            toast.error('Erro ao excluir: ' + err.message);
        }
    };

    useEffect(() => {
        if (activeTab === 'briefings') fetchBriefings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleClientLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `client-${Date.now()}.${fileExt}`;
            const filePath = `clients/${fileName}`;

            setUploadingImage(idx); // reusar a flag para spinner visual

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);

            setSiteContent((prev: any) => {
                if (!prev) return prev;
                const newClients = [...(prev.trusted_clients || [])];
                newClients[idx] = { ...newClients[idx], logoUrl: data.publicUrl };
                return { ...prev, trusted_clients: newClients };
            });
            toast.success("Logo anexada com sucesso!");
        } catch (error: any) {
            toast.error('Erro ao fazer upload da logo. Erro: ' + error.message);
        } finally {
            setUploadingImage(null);
        }
    };

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

    const autoTranslate = async (text: string, idx: number, enField: string) => {
        if (!text?.trim()) return;
        const key = `${idx}_${enField}`;
        setIsTranslating(prev => ({ ...prev, [key]: true }));
        try {
            const res = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLang: 'en' })
            });
            const data = await res.json();
            if (data.error) {
                toast.error("Erro na tradução: " + data.error);
                return;
            }
            if (!data.translatedText) {
                toast.error("Tradução retornou vazia. Verifique a API Key no Vercel.");
                return;
            }
            const newProjs = [...siteContent.featured_projects];
            newProjs[idx] = { ...newProjs[idx], [enField]: data.translatedText };
            updateSection('featured_projects', newProjs);
            toast.success("Traduzido com sucesso!");
        } catch (err: any) {
            toast.error("Erro ao traduzir: " + (err?.message || "verifique o console"));
        } finally {
            setIsTranslating(prev => ({ ...prev, [key]: false }));
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
        const cep = (document.getElementById(`client-cep-${clientId}`) as HTMLInputElement)?.value;
        const addressRaw = (document.getElementById(`client-address-${clientId}`) as HTMLInputElement)?.value;

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
                    cep,
                    addressRaw,
                    document: (document.getElementById(`client-doc-${clientId}`) as HTMLInputElement)?.value,
                    companyName: (document.getElementById(`client-company-${clientId}`) as HTMLInputElement)?.value,
                    adminToken: session?.access_token
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success('Dados do cliente atualizados com sucesso!');
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, full_name: fullName, email, phone, cep } : c));

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

            // Trigger Email Notification to Client (Fire and forget style)
            const projectToUpdate = allProjects.find(p => p.id === projId);
            const clientInfo = clients.find(c => c.id === projectToUpdate?.client_id);
            if (clientInfo?.email) {
                fetch('/api/admin/notify-project-update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clientEmail: clientInfo.email,
                        clientName: clientInfo.full_name,
                        projectName: name,
                        status,
                        currentStep: parseInt(currentStep)
                    })
                }).catch(e => console.error("Falha ao enviar e-mail:", e));
            }

        } catch (err: any) {
            toast.error('Erro ao salvar: ' + err.message);
        }
    };

    const updateProjectFinance = async (projId: string, value: string, paymentMethod: string) => {
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    value: value,
                    payment_method: paymentMethod
                })
                .eq('id', projId);

            if (error) {
                if (error.message.includes('column "value"') || error.message.includes('column "payment_method"')) {
                    toast.error('Erro: Colunas financeiras não encontradas. Adicione "value" e "payment_method" na tabela "projects" do Supabase.');
                    return;
                }
                throw error;
            }

            toast.success('Dados financeiros atualizados!');

            // Update local state
            setClientData(prev => {
                const newData = { ...prev };
                for (const clientId in newData) {
                    if (newData[clientId].projects) {
                        newData[clientId].projects = newData[clientId].projects.map((p: any) =>
                            p.id === projId ? { ...p, value, payment_method: paymentMethod } : p
                        );
                    }
                }
                return newData;
            });
        } catch (err: any) {
            toast.error('Erro ao atualizar financeiro: ' + err.message);
        }
    };

    const createClientAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Criando conta do cliente...");

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/create-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newClientData,
                    adminToken: session?.access_token
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success('Cliente criado com sucesso! Dados salvos e acesso liberado.', { id: toastId });

            // Refresh clients list
            const { data: clientsData } = await supabase.from('profiles').select('*').eq('role', 'client');
            if (clientsData) setClients(clientsData);

            setIsCreatingClient(false);
            setNewClientData(prev => ({
                ...prev,
                fullName: '',
                email: '',
                password: '',
                phone: '',
                document: '',
                emergencyContact: '',
                companyName: '',
                cep: '',
                address: { logradouro: '', numero: '', bairro: '', cidade: '', uf: '' }
            }));
        } catch (err: any) {
            toast.error('Erro ao criar: ' + err.message, { id: toastId });
        }
    };

    const handleCepChange = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        setNewClientData(prev => ({ ...prev, cep: cleanCep }));

        if (cleanCep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setNewClientData(prev => ({
                        ...prev,
                        address: {
                            ...prev.address,
                            logradouro: data.logradouro,
                            bairro: data.bairro,
                            cidade: data.localidade,
                            uf: data.uf
                        }
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    const deleteClient = async (clientId: string, clientName: string) => {
        if (!confirm(`EXCLUIR O CLIENTE "${clientName}"? ESTA AÇÃO REMOVE PROJETOS, BRIEFINGS E A CONTA. IRREVERSÍVEL.`)) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/delete-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, adminToken: session?.access_token }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Erro ao excluir');

            toast.success('Cliente excluído.');
            setClients(prev => prev.filter(c => c.id !== clientId));
            setClientData(prev => { const n = { ...prev }; delete n[clientId]; return n; });
            if (expandedClient === clientId) setExpandedClient(null);
        } catch (err: any) {
            toast.error('Erro: ' + err.message);
        }
    };

    const getContractTemplate = (client: any, project: any) => {
        const today = new Date().toLocaleDateString('pt-BR');
        const val = project.value || '0.00';
        const method = project.payment_method || 'A combinar';
        const address = client.address ? `${client.address.logradouro}, ${client.address.numero} - ${client.address.bairro}, ${client.address.cidade}/${client.address.uf}` : 'Não informado';

        return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO

CONTRATADA: CACTUS CREATIVE CC
CNPJ: [INSERIR SEU CNPJ AQUI]

CONTRATANTE: ${client.full_name || client.company_name || 'CLIENTE'}
CPF/CNPJ: ${client.document || '[NÃO INFORMADO]'}
ENDEREÇO: ${address}

OBJETO DO CONTRATO:
Desenvolvimento de ${project.name || 'projeto digital'}.

VALOR TOTAL DO INVESTIMENTO:
R$ ${val}

FORMA DE PAGAMENTO:
${method}

PRAZO DE ENTREGA:
Conforme detalhado no cronograma do projeto em anexo.

DATA: ${today}

_____________________________________
CACTUS CREATIVE CC

_____________________________________
${client.full_name || 'CONTRATANTE'}`;
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
        const toastId = toast.loading("Processando e traduzindo conteúdo...");

        try {
            let finalContent = { ...siteContent };
            console.log("Iniciando salvamento. Conteúdo atual:", finalContent);

            // Tradução automática para depoimentos (Success Stories)
            if (finalContent.success_stories && Array.isArray(finalContent.success_stories)) {
                let hasChanges = false;
                const translatedStories = await Promise.all(finalContent.success_stories.map(async (story: any, idx: number) => {
                    const needsCommentTrans = story.comment && !story.comment_en?.trim();
                    const needsProfessionTrans = story.profession && !story.profession_en?.trim();

                    if (needsCommentTrans || needsProfessionTrans) {
                        console.log(`Traduzindo depoimento #${idx + 1}...`);
                        hasChanges = true;
                        const newStory = { ...story };

                        if (needsCommentTrans) {
                            try {
                                const res = await fetch('/api/admin/translate', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: story.comment })
                                });
                                const data = await res.json();
                                if (data.translatedText) newStory.comment_en = data.translatedText;
                            } catch (e) { console.error(`Erro na tradução do comentário #${idx + 1}:`, e); }
                        }

                        if (needsProfessionTrans) {
                            try {
                                const res = await fetch('/api/admin/translate', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: story.profession })
                                });
                                const data = await res.json();
                                if (data.translatedText) newStory.profession_en = data.translatedText;
                            } catch (e) { console.error(`Erro na tradução da profissão #${idx + 1}:`, e); }
                        }

                        return newStory;
                    }
                    return story;
                }));

                if (hasChanges) {
                    finalContent.success_stories = translatedStories;
                    setSiteContent({ ...finalContent });
                }
            }

            const { error } = await supabase
                .from('site_content')
                .upsert({ slug: 'landing-page', content: finalContent, updated_at: new Date().toISOString() });

            if (error) {
                toast.error("Erro ao salvar: " + error.message, { id: toastId });
            } else {
                toast.success("Site atualizado! Traduções aplicadas.", { id: toastId });
            }
        } catch (err) {
            console.error("Erro crítico no saveSiteContent:", err);
            toast.error("Erro interno ao processar conteúdo.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
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
                    className={`flex items-center gap-4 px-6 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all cursor-pointer ${activeTab === 'clients' ? 'bg-primary text-black' : 'bg-surface-container-high text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Users size={16} />
                    {t.Portal.admin_clients}
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center gap-4 px-6 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all cursor-pointer ${activeTab === 'projects' ? 'bg-primary text-black' : 'bg-surface-container-high text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Layers size={16} />
                    {t.Portal.admin_projects}
                </button>
                <button
                    onClick={() => setActiveTab('customization')}
                    className={`flex items-center gap-4 px-6 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all cursor-pointer ${activeTab === 'customization' ? 'bg-primary text-black' : 'bg-surface-container-high text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Settings size={16} />
                    {t.Portal.admin_customization}
                </button>
                <button
                    onClick={() => setActiveTab('briefings')}
                    className={`flex items-center gap-4 px-6 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all cursor-pointer ${activeTab === 'briefings' ? 'bg-primary text-black' : 'bg-surface-container-high text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FileText size={16} />
                    LEADS
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
                                <button
                                    onClick={() => setIsCreatingClient(true)}
                                    className="bg-primary text-black px-6 py-4 font-black text-[10px] tracking-widest uppercase hover:bg-white transition-all"
                                >
                                    ADICIONAR CLIENTE
                                </button>
                            </div>

                            {/* MODAL ADICIONAR CLIENTE */}
                            <AnimatePresence>
                                {isCreatingClient && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.95, opacity: 0 }}
                                            className="bg-surface-container-highest border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8"
                                        >
                                            <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-8">
                                                <div>
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">CADASTRAR NOVO PARCEIRO</h3>
                                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Insira os dados para criar o acesso e o perfil</p>
                                                </div>
                                                <button onClick={() => setIsCreatingClient(false)} className="text-neutral-500 hover:text-white transition-colors">
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            <form onSubmit={createClientAccount} className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Passo 1: Acesso */}
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-4">1. DADOS DE ACESSO</h4>
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">E-MAIL DO CLIENTE</label>
                                                            <input required type="email" value={newClientData.email} onChange={e => setNewClientData(p => ({ ...p, email: e.target.value }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" placeholder="email@exemplo.com" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">SENHA INICIAL</label>
                                                            <input required type="text" value={newClientData.password} onChange={e => setNewClientData(p => ({ ...p, password: e.target.value }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" placeholder="Defina a senha de acesso" />
                                                        </div>
                                                    </div>

                                                    {/* Passo 2: Perfil */}
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-4">2. INFORMAÇÕES PESSOAIS</h4>
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NOME COMPLETO</label>
                                                            <input required type="text" value={newClientData.fullName} onChange={e => setNewClientData(p => ({ ...p, fullName: e.target.value }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" placeholder="Nome do representante" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">CPF / CNPJ</label>
                                                                <input required type="text" value={newClientData.document} onChange={e => setNewClientData(p => ({ ...p, document: e.target.value }))} className="w-full bg-background border border-primary/20 p-3 text-primary font-black text-[10px] focus:border-primary focus:outline-none transition-colors" placeholder="000.000.000-00" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">TELEFONE / WHATSAPP</label>
                                                                <input required type="text" value={newClientData.phone} onChange={e => setNewClientData(p => ({ ...p, phone: e.target.value }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" placeholder="(00) 00000-0000" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NOME DA EMPRESA</label>
                                                            <input required type="text" value={newClientData.companyName} onChange={e => setNewClientData(p => ({ ...p, companyName: e.target.value }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" placeholder="Razão Social ou Nome Fantasia" />
                                                        </div>
                                                    </div>

                                                    {/* Passo 3: Endereço */}
                                                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-white/5">
                                                        <h4 className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-4">3. LOCALIZAÇÃO (CEP)</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">CEP</label>
                                                                <input type="text" value={newClientData.cep} onChange={e => handleCepChange(e.target.value)} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" placeholder="00000-000" />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">LOGRADOURO</label>
                                                                <input type="text" value={newClientData.address.logradouro} onChange={e => setNewClientData(p => ({ ...p, address: { ...p.address, logradouro: e.target.value } }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NÚMERO</label>
                                                                <input type="text" value={newClientData.address.numero} onChange={e => setNewClientData(p => ({ ...p, address: { ...p.address, numero: e.target.value } }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">BAIRRO</label>
                                                                <input type="text" value={newClientData.address.bairro} onChange={e => setNewClientData(p => ({ ...p, address: { ...p.address, bairro: e.target.value } }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">CIDADE</label>
                                                                <input type="text" value={newClientData.address.cidade} onChange={e => setNewClientData(p => ({ ...p, address: { ...p.address, cidade: e.target.value } }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">ESTADO (UF)</label>
                                                                <input type="text" value={newClientData.address.uf} onChange={e => setNewClientData(p => ({ ...p, address: { ...p.address, uf: e.target.value } }))} className="w-full bg-background border border-white/5 p-3 text-white font-bold text-[10px] focus:border-primary focus:outline-none transition-colors" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                                                    <button type="button" onClick={() => setIsCreatingClient(false)} className="px-8 py-4 font-black text-[10px] tracking-widest uppercase text-neutral-500 hover:text-white transition-all">
                                                        CANCELAR
                                                    </button>
                                                    <button type="submit" className="bg-primary text-black px-10 py-4 font-black text-[10px] tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(174,213,0,0.2)]">
                                                        CRIAR CONTA DO CLIENTE
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                            <div className="flex gap-4 items-center">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[8px] font-black text-neutral-600 uppercase">STATUS</p>
                                                    <p className="text-xs font-bold text-white tracking-widest uppercase">{clientData[client.id]?.projects?.length > 0 ? 'ATIVO' : 'INATIVO'}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteClient(client.id, client.full_name || client.email); }}
                                                    title="Excluir cliente"
                                                    className="w-8 h-8 flex items-center justify-center border border-white/10 text-neutral-600 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                                <ChevronRight className={`text-neutral-700 group-hover:text-primary transition-transform ${expandedClient === client.id ? 'rotate-90 text-primary' : ''}`} />
                                            </div>
                                        </div>

                                        {expandedClient === client.id && (
                                            <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
                                                {/* INNER TAB NAVIGATION */}
                                                <div className="flex flex-wrap gap-2 mb-8 bg-black/20 p-1 rounded-none border border-white/5">
                                                    {[
                                                        { id: 'projects', label: 'PROJETOS & STATUS', icon: Layers },
                                                        { id: 'finance', label: 'FINANCEIRO & CONTRATO', icon: CreditCard },
                                                        { id: 'chat', label: 'COMUNICAÇÃO & ARQUIVOS', icon: MessageSquare },
                                                        { id: 'settings', label: 'DADOS DO CLIENTE', icon: Settings },
                                                    ].map(tab => (
                                                        <button
                                                            key={tab.id}
                                                            onClick={(e) => { e.stopPropagation(); setClientInnerTabs(prev => ({ ...prev, [client.id]: tab.id as any })); }}
                                                            className={`flex items-center gap-3 px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all ${clientInnerTabs[client.id] === tab.id || (!clientInnerTabs[client.id] && tab.id === 'projects')
                                                                ? 'bg-primary text-black'
                                                                : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <tab.icon size={12} />
                                                            {tab.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="min-h-[400px]">
                                                    {/* TAB 1: PROJETOS */}
                                                    {(clientInnerTabs[client.id] === 'projects' || !clientInnerTabs[client.id]) && (
                                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                            <div className="flex justify-between items-center mb-6">
                                                                <h5 className="text-[10px] uppercase font-black text-primary tracking-widest flex items-center gap-2">
                                                                    <span className="w-1 h-3 bg-primary inline-block"></span>
                                                                    PROJETOS ATIVOS
                                                                </h5>
                                                                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                                                                    {clientData[client.id]?.projects?.length || 0} PROJETO(S) ENCONTRADO(S)
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 gap-4">
                                                                {clientData[client.id]?.projects?.length > 0 ? clientData[client.id].projects.map((proj: any) => (
                                                                    <div key={proj.id} className="bg-background border border-white/5 p-6 relative group hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center gap-8">
                                                                        {/* Info Section */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <h6 className="font-black text-white uppercase text-base mb-1 tracking-tight flex items-center gap-3">
                                                                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                                                                {proj.name}
                                                                            </h6>
                                                                            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest line-clamp-1 max-w-xl">
                                                                                {proj.description}
                                                                            </p>
                                                                        </div>

                                                                        {/* Status Badge */}
                                                                        <div className="shrink-0 flex flex-col items-start gap-2 hidden lg:flex">
                                                                            <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest">ESTÁGIO ATUAL</span>
                                                                            <span className="bg-primary/10 text-primary border border-primary/20 text-[8px] font-black px-4 py-2 uppercase tracking-[0.2em] min-w-[110px] text-center shadow-[0_0_15px_rgba(174,213,0,0.05)]">
                                                                                {proj.status}
                                                                            </span>
                                                                        </div>

                                                                        {/* Progress Section */}
                                                                        <div className="w-full md:w-64 space-y-2">
                                                                            <div className="flex justify-between items-center mb-1">
                                                                                <div className="flex flex-col lg:hidden">
                                                                                    <span className="text-[6px] font-black text-neutral-600 uppercase tracking-tighter">STATUS: {proj.status}</span>
                                                                                    <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">PROGRESSO ATUAL</span>
                                                                                </div>
                                                                                <span className="hidden lg:block text-[8px] font-black text-neutral-600 uppercase tracking-widest">PROGRESSO ATUAL</span>
                                                                                <span className="text-[10px] text-primary font-black tracking-widest">{proj.current_step}%</span>
                                                                            </div>
                                                                            <div className="h-[3.5px] w-full bg-white/5 rounded-none overflow-hidden relative">
                                                                                <motion.div
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: `${proj.current_step}%` }}
                                                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                                                    className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_rgba(174,213,0,0.5)]"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* Action Section */}
                                                                        <div className="flex items-center gap-3">
                                                                            <button
                                                                                onClick={() => { setActiveTab('projects'); setExpandedProject(proj.id); }}
                                                                                className="px-6 py-4 bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                                                            >
                                                                                <Edit size={12} /> GERENCIAR
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )) : (
                                                                    <div className="py-16 border border-dashed border-white/10 flex flex-col items-center justify-center grayscale opacity-50 bg-white/[0.01]">
                                                                        <Briefcase className="w-12 h-12 mb-4 text-neutral-700" />
                                                                        <p className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">NENHUM PROJETO VINCULADO AO CLIENTE</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* TAB 2: FINANCEIRO */}
                                                    {clientInnerTabs[client.id] === 'finance' && (
                                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                                <div className="md:col-span-2 space-y-6">
                                                                    <h5 className="text-[10px] uppercase font-black text-primary tracking-widest flex items-center gap-2">
                                                                        <span className="w-1 h-3 bg-primary inline-block"></span>
                                                                        CONTRATOS E FATURAMENTO
                                                                    </h5>

                                                                    <div className="bg-surface-container-high border border-white/5 overflow-hidden">
                                                                        <table className="w-full text-left border-collapse">
                                                                            <thead>
                                                                                <tr className="border-b border-white/5">
                                                                                    <th className="p-4 text-[8px] font-black text-neutral-600 uppercase">PROJETO</th>
                                                                                    <th className="p-4 text-[8px] font-black text-neutral-600 uppercase">VALOR</th>
                                                                                    <th className="p-4 text-[8px] font-black text-neutral-600 uppercase text-right">AÇÕES</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {clientData[client.id]?.projects?.length > 0 ? clientData[client.id].projects.map((proj: any) => (
                                                                                    <tr key={proj.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                                        <td className="p-4">
                                                                                            <div className="text-[10px] font-bold text-white uppercase">{proj.name}</div>
                                                                                            <div className="text-[8px] text-neutral-500 uppercase mt-1">{proj.status}</div>
                                                                                        </td>
                                                                                        <td className="p-4">
                                                                                            <div className="space-y-2">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className="text-[8px] text-neutral-600 font-black">R$</span>
                                                                                                    <input
                                                                                                        id={`proj-val-${proj.id}`}
                                                                                                        defaultValue={proj.value}
                                                                                                        placeholder="0.00"
                                                                                                        className="bg-black/40 border border-white/5 p-2 text-[10px] text-primary font-black w-24 focus:border-primary outline-none"
                                                                                                    />
                                                                                                </div>
                                                                                                <input
                                                                                                    id={`proj-method-${proj.id}`}
                                                                                                    defaultValue={proj.payment_method}
                                                                                                    placeholder="FORMA DE PAGTO"
                                                                                                    className="bg-black/40 border border-white/5 p-2 text-[8px] text-white w-full focus:border-primary outline-none uppercase"
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="p-4 text-right">
                                                                                            <div className="flex flex-col gap-2">
                                                                                                <button
                                                                                                    onClick={() => updateProjectFinance(
                                                                                                        proj.id,
                                                                                                        (document.getElementById(`proj-val-${proj.id}`) as HTMLInputElement)?.value,
                                                                                                        (document.getElementById(`proj-method-${proj.id}`) as HTMLInputElement)?.value
                                                                                                    )}
                                                                                                    className="text-[8px] font-black text-neutral-400 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-2 transition-all hover:border-white"
                                                                                                >
                                                                                                    SALVAR DADOS
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() => setSelectedContractProject({ ...proj, client_owner: client })}
                                                                                                    className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest bg-primary/10 px-3 py-2 transition-all"
                                                                                                >
                                                                                                    GERAR CONTRATO
                                                                                                </button>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                )) : (
                                                                                    <tr>
                                                                                        <td colSpan={3} className="p-8 text-center text-[10px] text-neutral-600 uppercase font-black">NÃO HÁ PROJETOS PARA FATURAR</td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-6">
                                                                    <h5 className="text-[10px] uppercase font-black text-white/40 tracking-widest flex items-center gap-2">
                                                                        TOTAL EM CONTRATOS
                                                                    </h5>
                                                                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-none">
                                                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">SALDO ACORDADO</div>
                                                                        <div className="text-4xl font-black text-white tracking-tighter">
                                                                            R$ {clientData[client.id]?.projects?.reduce((acc: number, p: any) => acc + (parseFloat(p.value) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* TAB 3: COMUNICAÇÃO */}
                                                    {clientInnerTabs[client.id] === 'chat' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                            <div>
                                                                <h5 className="text-[10px] uppercase font-black text-primary tracking-widest mb-6 flex items-center gap-2">
                                                                    <span className="w-1 h-3 bg-primary inline-block"></span>
                                                                    ARQUIVOS RECENTES
                                                                </h5>
                                                                <div className="bg-background border border-white/5 p-4 space-y-2 h-[350px] overflow-y-auto custom-scrollbar">
                                                                    {clientData[client.id]?.attachments?.length > 0 ?
                                                                        clientData[client.id].attachments.map((file: any) => (
                                                                            <div key={file.id} className="flex justify-between items-center group p-3 border border-white/5 hover:border-primary/30 hover:bg-white/[0.02] transition-colors">
                                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                                    <FileText size={14} className="text-neutral-500" />
                                                                                    <span className="text-[10px] text-neutral-300 uppercase font-bold truncate tracking-widest">{file.name}</span>
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary transition-colors">
                                                                                        <Download size={14} />
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        )) : (
                                                                            <div className="h-full flex items-center justify-center grayscale opacity-30">
                                                                                <p className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">NENHUM ARQUIVO</p>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h5 className="text-[10px] uppercase font-black text-primary tracking-widest mb-6 flex items-center gap-2">
                                                                    <span className="w-1 h-3 bg-primary inline-block"></span>
                                                                    COMUNICAÇÃO
                                                                </h5>
                                                                <div className="bg-background border border-white/5 p-8 flex flex-col items-center justify-center h-[350px] text-center">
                                                                    <MessageSquare className="w-8 h-8 text-neutral-800 mb-4" />
                                                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                                                                        USE O CENTRO DE MENSAGENS PARA<br />FALAR COM ESTE CLIENTE
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* TAB 4: CONFIGURAÇÕES / DADOS DO CLIENTE */}
                                                    {clientInnerTabs[client.id] === 'settings' && (
                                                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                            {/* 1. Identificação Principal */}
                                                            <div className="space-y-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/20">
                                                                        <Users className="text-primary" size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="text-[10px] uppercase font-black text-white tracking-[0.3em]">
                                                                            1. IDENTIFICAÇÃO PRINCIPAL
                                                                        </h5>
                                                                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Dados fundamentais para documentos e contratos</p>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div className="md:col-span-1">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">NOME COMPLETO / TITULAR</label>
                                                                        <input id={`client-name-${client.id}`} defaultValue={client.full_name} className="w-full bg-background border border-white/5 p-4 text-white font-bold text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                    <div className="md:col-span-1">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block border-l-2 border-primary/40 pl-3">CPF / CNPJ (USADO NO CONTRATO)</label>
                                                                        <input id={`client-doc-${client.id}`} defaultValue={client.document || ''} placeholder="000.000.000-00" className="w-full bg-background border border-primary/20 p-4 text-primary font-black text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                    <div className="md:col-span-2">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">RAZÃO SOCIAL / EMPRESA</label>
                                                                        <input id={`client-company-${client.id}`} defaultValue={client.company_name} className="w-full bg-background border border-white/5 p-4 text-white font-bold text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* 2. Comunicação e Acesso */}
                                                            <div className="space-y-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/10">
                                                                        <MessageSquare className="text-neutral-400" size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="text-[10px] uppercase font-black text-white tracking-[0.3em]">
                                                                            2. COMUNICAÇÃO E ACESSO
                                                                        </h5>
                                                                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Gestão de contato e credenciais de login</p>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                    <div className="md:col-span-1">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">E-MAIL PRINCIPAL</label>
                                                                        <input id={`client-email-${client.id}`} defaultValue={client.email} className="w-full bg-background border border-white/5 p-4 text-white font-bold text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                    <div className="md:col-span-1">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">TELEFONE / WHATSAPP</label>
                                                                        <input id={`client-phone-${client.id}`} defaultValue={client.phone || ''} className="w-full bg-background border border-white/5 p-4 text-white font-bold text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                    <div className="md:col-span-1">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">ALTERAR SENHA (DEIXE VAZIO SE NÃO FOR MUDAR)</label>
                                                                        <input id={`client-pwd-${client.id}`} type="password" placeholder="MÍNIMO 6 CARACTERES" className="w-full bg-background border border-white/5 p-4 text-white font-bold text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* 3. Localização */}
                                                            <div className="space-y-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/10">
                                                                        <Briefcase className="text-neutral-400" size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="text-[10px] uppercase font-black text-white tracking-[0.3em]">
                                                                            3. LOCALIZAÇÃO E LOGRADOURO
                                                                        </h5>
                                                                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Endereço para fins de faturamento e registro</p>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                                    <div className="md:col-span-1">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">CEP</label>
                                                                        <input id={`client-cep-${client.id}`} defaultValue={client.cep || ''} className="w-full bg-background border border-white/5 p-4 text-white font-bold text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                    <div className="md:col-span-3">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block">ENDEREÇO COMPLETO</label>
                                                                        <input id={`client-address-${client.id}`} defaultValue={client.address ? `${client.address.logradouro}, ${client.address.numero} - ${client.address.bairro}` : ''} placeholder="Rua exemplo, 123 - Bairro" className="w-full bg-background border border-white/5 p-4 text-white font-bold text-[11px] focus:border-primary focus:outline-none transition-colors" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end pt-10 border-t border-white/5">
                                                                <button
                                                                    onClick={() => saveClientData(client.id)}
                                                                    className="bg-primary text-black px-16 py-6 font-black text-xs tracking-[0.3em] uppercase hover:bg-white transition-all shadow-[0_0_50px_rgba(174,213,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                                                >
                                                                    SALVAR ALTERAÇÕES DO PERFIL
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
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
                                    className="bg-primary text-black px-10 py-4 font-black text-xs tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(174,213,0,0.2)]"
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
                                            { id: 'clients', label: 'CLIENTES', icon: Users },
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveCustomTab(item.id as any)}
                                                className={`flex items-center gap-3 px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all cursor-pointer ${activeCustomTab === item.id
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
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase mb-8 border-l-2 border-primary pl-4">ESTADO DE OPERAÇÃO</h3>
                                                    <div className="bg-background border border-white/5 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5 rounded-sm overflow-hidden">
                                                        {/* Col 1: Título e Descrição */}
                                                        <div className="p-6 md:p-8 flex flex-col justify-center">
                                                            <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-2">Capacidade</h4>
                                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">Controle em tempo real de vagas</p>
                                                        </div>

                                                        {/* Col 2: Controlador */}
                                                        <div className="p-6 md:p-8 flex items-center justify-center gap-6 bg-white/[0.02]">
                                                            <button
                                                                onClick={() => updateSection('general', { ...siteContent?.general, project_slots: Math.max(0, Number(siteContent?.general?.project_slots || 0) - 1) })}
                                                                className="w-12 h-12 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all text-2xl font-light cursor-pointer select-none rounded-sm bg-background shadow-lg"
                                                            >
                                                                −
                                                            </button>
                                                            <div className="flex flex-col items-center min-w-[80px]">
                                                                <span className="text-5xl font-black text-primary leading-none tracking-tighter tabular-nums drop-shadow-sm">
                                                                    {siteContent?.general?.project_slots ?? 1}
                                                                </span>
                                                                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mt-4">
                                                                    vagas ativas
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => updateSection('general', { ...siteContent?.general, project_slots: Number(siteContent?.general?.project_slots || 0) + 1 })}
                                                                className="w-12 h-12 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all text-2xl font-light cursor-pointer select-none rounded-sm bg-background shadow-lg"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* Col 3: Status Visual */}
                                                        <div className={`p-6 md:p-8 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${Number(siteContent?.general?.project_slots) > 0 ? 'bg-primary/[0.03]' : 'bg-red-500/[0.03]'}`}>
                                                            {/* Aura Glow */}
                                                            <div className={`absolute inset-0 opacity-[0.15] blur-3xl pointer-events-none rounded-full scale-150 ${Number(siteContent?.general?.project_slots) > 0 ? 'bg-primary' : 'bg-red-500'}`} />

                                                            <div className={`w-2 h-2 rounded-full mb-3 shadow-[0_0_10px_currentColor] animate-pulse relative z-10 ${Number(siteContent?.general?.project_slots) > 0 ? 'bg-primary text-primary' : 'bg-red-500 text-red-500'}`} />
                                                            <span className={`text-[11px] font-black tracking-[0.2em] relative z-10 uppercase leading-none mb-2 ${Number(siteContent?.general?.project_slots) > 0 ? 'text-primary' : 'text-red-500'}`}>
                                                                {Number(siteContent?.general?.project_slots) > 0 ? 'Operacional' : 'Lotado'}
                                                            </span>
                                                            <span className="text-[8px] font-bold opacity-60 uppercase text-neutral-400 relative z-10 tracking-widest">
                                                                Hero Section
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

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

                                                {/* ── REDES SOCIAIS ── */}
                                                <div>
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase mb-8 border-l-2 border-primary pl-4">REDES SOCIAIS</h3>
                                                    <div className="bg-surface-container-high border border-white/5 p-8 space-y-6">
                                                        {/* Lista de redes */}
                                                        <div className="space-y-3">
                                                            {(siteContent?.general?.social_links || []).map((social: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-3 bg-background border border-white/5 p-3 group hover:border-white/10 transition-all">
                                                                    {/* Ícone selector */}
                                                                    <select
                                                                        value={social.icon || 'link'}
                                                                        onChange={(e) => {
                                                                            const updated = [...(siteContent.general.social_links || [])];
                                                                            updated[idx] = { ...updated[idx], icon: e.target.value };
                                                                            updateSection('general', { ...siteContent.general, social_links: updated });
                                                                        }}
                                                                        className="bg-white/5 border border-white/10 text-primary text-[9px] font-black tracking-widest uppercase p-2 focus:border-primary focus:outline-none transition-all w-32 shrink-0"
                                                                    >
                                                                        <option value="instagram">INSTAGRAM</option>
                                                                        <option value="youtube">YOUTUBE</option>
                                                                        <option value="facebook">FACEBOOK</option>
                                                                        <option value="x">X (TWITTER)</option>
                                                                        <option value="linkedin">LINKEDIN</option>
                                                                        <option value="tiktok">TIKTOK</option>
                                                                        <option value="whatsapp">WHATSAPP</option>
                                                                        <option value="github">GITHUB</option>
                                                                        <option value="link">OUTRO</option>
                                                                    </select>
                                                                    {/* Label */}
                                                                    <input
                                                                        value={social.label || ''}
                                                                        placeholder="Ex: @cactuscreative.cc"
                                                                        onChange={(e) => {
                                                                            const updated = [...(siteContent.general.social_links || [])];
                                                                            updated[idx] = { ...updated[idx], label: e.target.value };
                                                                            updateSection('general', { ...siteContent.general, social_links: updated });
                                                                        }}
                                                                        className="flex-1 bg-transparent border-b border-white/10 py-2 text-white text-[10px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-neutral-700"
                                                                    />
                                                                    {/* URL */}
                                                                    <input
                                                                        value={social.url || ''}
                                                                        placeholder="https://..."
                                                                        onChange={(e) => {
                                                                            const updated = [...(siteContent.general.social_links || [])];
                                                                            updated[idx] = { ...updated[idx], url: e.target.value };
                                                                            updateSection('general', { ...siteContent.general, social_links: updated });
                                                                        }}
                                                                        className="flex-1 bg-transparent border-b border-white/10 py-2 text-neutral-400 text-[10px] focus:outline-none focus:border-primary transition-all placeholder:text-neutral-700"
                                                                    />
                                                                    {/* Delete */}
                                                                    <button
                                                                        onClick={() => {
                                                                            const updated = (siteContent.general.social_links || []).filter((_: any, i: number) => i !== idx);
                                                                            updateSection('general', { ...siteContent.general, social_links: updated });
                                                                        }}
                                                                        className="p-2 text-neutral-700 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                                                        title="Remover"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Add button */}
                                                        <button
                                                            onClick={() => {
                                                                const current = siteContent?.general?.social_links || [];
                                                                updateSection('general', {
                                                                    ...siteContent.general,
                                                                    social_links: [...current, { icon: 'instagram', label: '', url: '' }]
                                                                });
                                                            }}
                                                            className="w-full border border-dashed border-white/10 py-4 text-[9px] font-black tracking-[0.4em] text-neutral-600 hover:border-primary hover:text-primary transition-all uppercase flex items-center justify-center gap-3 group"
                                                        >
                                                            <Plus className="group-hover:scale-125 transition-transform" size={14} />
                                                            ADICIONAR REDE SOCIAL
                                                        </button>

                                                        <p className="text-[9px] text-neutral-700 font-bold uppercase tracking-widest">
                                                            As redes são exibidas automaticamente no rodapé do site após salvar.
                                                        </p>
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
                                                                                newCaps[idx] = { ...newCaps[idx], tag: e.target.value };
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
                                                                                newCaps[idx] = { ...newCaps[idx], tag_en: e.target.value };
                                                                                updateSection('capabilities', newCaps);
                                                                            }}
                                                                            className="w-full bg-blue-400/5 text-blue-400 border border-blue-400/20 p-2 text-[10px] font-black tracking-widest uppercase focus:bg-blue-400/10 focus:outline-none transition-all placeholder:text-blue-900"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 max-w-[150px]">
                                                                        <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">COR DA TAG</label>
                                                                        <select
                                                                            value={cap.tag_color || (idx === 0 ? 'neutral' : (idx === 2 || idx === 5) ? 'yellow' : 'primary')}
                                                                            onChange={(e) => {
                                                                                const newCaps = [...siteContent.capabilities];
                                                                                newCaps[idx] = { ...newCaps[idx], tag_color: e.target.value };
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
                                                                        newCaps[idx] = { ...newCaps[idx], title: e.target.value };
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
                                                                        newCaps[idx] = { ...newCaps[idx], title_en: e.target.value };
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
                                                                        newCaps[idx] = { ...newCaps[idx], text: e.target.value };
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
                                                                        newCaps[idx] = { ...newCaps[idx], text_en: e.target.value };
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
                                                                                    <Loader size="sm" />
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
                                                                                    <Loader size="xs" />
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
                                                                            <div className="flex justify-between items-center mb-2">
                                                                                <label className="text-[8px] font-black text-blue-400/60 uppercase tracking-widest flex items-center gap-2">
                                                                                    DESCRIÇÃO (EN)
                                                                                    {isTranslating[`${idx}_description_en`] && <span className="w-2 h-2 border border-blue-400/60 border-t-transparent rounded-full animate-spin inline-block" />}
                                                                                </label>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => proj.description?.trim() && autoTranslate(proj.description, idx, 'description_en')}
                                                                                    disabled={isTranslating[`${idx}_description_en`] || !proj.description?.trim()}
                                                                                    className="flex items-center gap-1 text-[8px] font-black text-blue-400/60 hover:text-blue-400 transition-all disabled:opacity-30 uppercase tracking-widest"
                                                                                >
                                                                                    <Sparkles size={10} />
                                                                                    AUTO-TRADUZIR
                                                                                </button>
                                                                            </div>
                                                                            <textarea
                                                                                value={proj.description_en || ''}
                                                                                onChange={(e) => {
                                                                                    const newProjs = [...siteContent.featured_projects];
                                                                                    newProjs[idx].description_en = e.target.value;
                                                                                    updateSection('featured_projects', newProjs);
                                                                                }}
                                                                                className="w-full bg-background border border-white/5 p-4 text-[11px] text-blue-400/60 font-medium leading-relaxed focus:border-blue-400/40 focus:outline-none transition-all resize-none placeholder:text-neutral-800"
                                                                                rows={4}
                                                                                placeholder={isTranslating[`${idx}_description_en`] ? "Traduzindo..." : "Project description in English..."}
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
                                                                    <div className="flex justify-between items-center mt-1 mb-0.5">
                                                                        <span className="text-[7px] text-blue-400/40 uppercase tracking-widest">EN</span>
                                                                        <button type="button" onClick={() => proj.stat1_label?.trim() && autoTranslate(proj.stat1_label, idx, 'stat1_label_en')} disabled={isTranslating[`${idx}_stat1_label_en`] || !proj.stat1_label?.trim()} className="text-[7px] font-black text-blue-400/50 hover:text-blue-400 transition-all disabled:opacity-30 uppercase flex items-center gap-1">
                                                                            {isTranslating[`${idx}_stat1_label_en`] ? <span className="w-2 h-2 border border-blue-400/60 border-t-transparent rounded-full animate-spin inline-block" /> : <Sparkles size={8} />}
                                                                            AUTO
                                                                        </button>
                                                                    </div>
                                                                    <input
                                                                        value={proj.stat1_label_en || ''}
                                                                        placeholder={isTranslating[`${idx}_stat1_label_en`] ? "Translating..." : "EN label..."}
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
                                                                    <div className="flex justify-between items-center mt-1 mb-0.5">
                                                                        <span className="text-[7px] text-blue-400/40 uppercase tracking-widest">EN</span>
                                                                        <button type="button" onClick={() => proj.stat2_label?.trim() && autoTranslate(proj.stat2_label, idx, 'stat2_label_en')} disabled={isTranslating[`${idx}_stat2_label_en`] || !proj.stat2_label?.trim()} className="text-[7px] font-black text-blue-400/50 hover:text-blue-400 transition-all disabled:opacity-30 uppercase flex items-center gap-1">
                                                                            {isTranslating[`${idx}_stat2_label_en`] ? <span className="w-2 h-2 border border-blue-400/60 border-t-transparent rounded-full animate-spin inline-block" /> : <Sparkles size={8} />}
                                                                            AUTO
                                                                        </button>
                                                                    </div>
                                                                    <input
                                                                        value={proj.stat2_label_en || ''}
                                                                        placeholder={isTranslating[`${idx}_stat2_label_en`] ? "Translating..." : "EN label..."}
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
                                                                    <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">PROFISSÃO / CARGO (PT)</label>
                                                                    <input
                                                                        value={story.profession}
                                                                        onChange={(e) => {
                                                                            const newS = [...siteContent.success_stories];
                                                                            newS[idx].profession = e.target.value;
                                                                            updateSection('success_stories', newS);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-3 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                    <label className="text-[8px] font-black text-blue-400/60 uppercase mt-2 mb-2 block tracking-widest">PROFISSION / ROLE (EN)</label>
                                                                    <input
                                                                        value={story.profession_en || ''}
                                                                        placeholder="Translation auto-generated..."
                                                                        onChange={(e) => {
                                                                            const newS = [...siteContent.success_stories];
                                                                            newS[idx].profession_en = e.target.value;
                                                                            updateSection('success_stories', newS);
                                                                        }}
                                                                        className="w-full bg-background border border-white/5 p-3 text-blue-400/60 font-black uppercase text-[10px] focus:border-blue-400/40 focus:outline-none transition-all placeholder:text-neutral-800"
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
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">DEPOIMENTO / COMENTÁRIO (PT)</label>
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
                                                                <label className="text-[8px] font-black text-blue-400/60 uppercase mt-4 mb-2 block tracking-widest">TESTIMONIAL / COMMENT (EN)</label>
                                                                <textarea
                                                                    value={story.comment_en || ''}
                                                                    placeholder="Translation auto-generated..."
                                                                    onChange={(e) => {
                                                                        const newS = [...siteContent.success_stories];
                                                                        newS[idx].comment_en = e.target.value;
                                                                        updateSection('success_stories', newS);
                                                                    }}
                                                                    className="w-full bg-background border border-white/5 p-4 text-[12px] text-blue-400/60 leading-relaxed focus:border-blue-400/40 focus:outline-none custom-scrollbar resize-none transition-all placeholder:text-neutral-800"
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

                                        {activeCustomTab === 'clients' && (
                                            <section className="animate-in fade-in slide-in-from-right-4">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h3 className="text-xs font-black tracking-[0.5em] text-primary uppercase border-l-2 border-primary pl-4">CLIENTES QUE ACREDITARAM EM NÓS</h3>
                                                    <button
                                                        onClick={() => {
                                                            const newClient = { name: "NOVO CLIENTE", logoUrl: "" };
                                                            updateSection('trusted_clients', [...(siteContent.trusted_clients || []), newClient]);
                                                        }}
                                                        className="bg-primary/10 border border-primary/20 text-primary px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-black transition-all flex items-center gap-2"
                                                    >
                                                        <Plus size={14} /> ADICIONAR CLIENTE
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {(siteContent.trusted_clients || []).map((client: any, idx: number) => (
                                                        <div key={idx} className="bg-surface-container-high border border-white/5 p-6 space-y-6 group hover:border-primary/20 transition-all relative">
                                                            <div className="absolute top-4 right-4 flex items-center gap-4">
                                                                <span className="text-[10px] font-black text-neutral-800">#{idx + 1}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const newClients = [...siteContent.trusted_clients];
                                                                        newClients.splice(idx, 1);
                                                                        updateSection('trusted_clients', newClients);
                                                                    }}
                                                                    title="Remover cliente"
                                                                    className="text-neutral-500 hover:text-red-500 transition-colors bg-black/20 p-2 border border-white/5 hover:border-red-500/30"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>

                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">NOME DO CLIENTE</label>
                                                                <input
                                                                    value={client.name}
                                                                    onChange={(e) => {
                                                                        const newClients = [...siteContent.trusted_clients];
                                                                        newClients[idx].name = e.target.value;
                                                                        updateSection('trusted_clients', newClients);
                                                                    }}
                                                                    className="w-full bg-background border border-white/5 p-3 text-white font-black uppercase text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[8px] font-black text-neutral-600 uppercase mb-2 block tracking-widest">LOGO DO CLIENTE</label>
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        value={client.logoUrl || ''}
                                                                        onChange={(e) => {
                                                                            const newClients = [...siteContent.trusted_clients];
                                                                            newClients[idx].logoUrl = e.target.value;
                                                                            updateSection('trusted_clients', newClients);
                                                                        }}
                                                                        placeholder="https://..."
                                                                        className="flex-1 bg-background border border-white/5 p-3 text-white text-[10px] focus:border-primary focus:outline-none transition-all"
                                                                    />
                                                                    <label className="bg-primary/10 text-primary border border-primary/20 px-4 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-black transition-all group/up min-w-[48px]">
                                                                        {uploadingImage === idx ? (
                                                                            <Loader size="sm" />
                                                                        ) : (
                                                                            <Download className="w-4 h-4 rotate-180" />
                                                                        )}
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={(e) => handleClientLogoUpload(e, idx)}
                                                                            disabled={uploadingImage === idx}
                                                                        />
                                                                    </label>
                                                                </div>

                                                                {client.logoUrl && (
                                                                    <div className="mt-3 w-full h-24 bg-white/5 flex items-center justify-center border border-white/5 relative p-4 group/img">
                                                                        <img src={client.logoUrl} alt={client.name} className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-all duration-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'briefings' && (
                        <motion.div
                            key="briefings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-white uppercase">LEADS & BRIEFINGS</h2>
                                    <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mt-1">Projetos enviados pelo bot de briefing</p>
                                </div>
                                <button
                                    onClick={fetchBriefings}
                                    disabled={isLoadingBriefings}
                                    className="border border-white/10 text-neutral-400 px-6 py-4 font-black text-[10px] tracking-widest uppercase hover:border-primary hover:text-primary transition-all disabled:opacity-40"
                                >
                                    {isLoadingBriefings ? 'CARREGANDO...' : 'ATUALIZAR'}
                                </button>
                            </div>

                            {isLoadingBriefings ? (
                                <div className="flex justify-center py-16">
                                    <Loader size="md" />
                                </div>
                            ) : briefings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <FileText size={32} className="text-neutral-700 mb-4" />
                                    <p className="text-neutral-500 text-[11px] uppercase tracking-widest">Nenhum briefing ainda</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {briefings.map((b) => {
                                        const isOpen = expandedBriefing === b.id;
                                        const statusColor = b.status === 'aprovado' ? 'text-green-400 bg-green-400/10' : b.status === 'em_andamento' ? 'text-primary bg-primary/10' : 'text-neutral-400 bg-white/5';
                                        return (
                                            <div key={b.id} className="border border-white/5 bg-surface-container-high">
                                                <div
                                                    onClick={() => setExpandedBriefing(isOpen ? null : b.id)}
                                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div>
                                                            <p className="font-black text-white text-sm uppercase tracking-tight">{b.company ?? '—'}</p>
                                                            <p className="text-[10px] text-neutral-500 mt-0.5">{b.email ?? '—'} · {b.project_type ?? '—'}</p>
                                                        </div>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${statusColor}`}>
                                                            {b.status ?? 'novo'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {b.preview_config?.palette && (
                                                            <div className="flex gap-1">
                                                                {Object.values(b.preview_config.palette).slice(0, 5).map((c: any, i: number) => (
                                                                    <div key={i} className="w-4 h-4 rounded-sm border border-white/10" style={{ backgroundColor: c }} />
                                                                ))}
                                                            </div>
                                                        )}
                                                        <span className="text-[9px] text-neutral-600">
                                                            {b.created_at ? new Date(b.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                                                        </span>
                                                        {profile?.role === 'admin' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteBriefing(b.id);
                                                                }}
                                                                className="p-2 text-neutral-600 hover:text-red-500 transition-all hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                                                                title="Deletar Lead"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                        <ChevronRight size={14} className={`text-neutral-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="border-t border-white/5 px-6 py-6 space-y-6">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            {[
                                                                ['EMPRESA', b.company],
                                                                ['EMAIL', b.email],
                                                                ['TIPO', b.project_type],
                                                                ['ORÇAMENTO', b.budget],
                                                                ['PRAZO', b.deadline],
                                                                ['PÚBLICO', b.target_audience],
                                                            ].map(([label, val]) => (
                                                                <div key={label} className="bg-background p-4 border border-white/5">
                                                                    <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-1">{label}</p>
                                                                    <p className="text-[11px] text-white font-bold">{val ?? '—'}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {b.project_goal && (
                                                            <div className="bg-background p-4 border border-white/5">
                                                                <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-1">OBJETIVO</p>
                                                                <p className="text-[11px] text-neutral-300 leading-relaxed">{b.project_goal}</p>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-3 gap-4">
                                                            {b.pages?.length > 0 && (
                                                                <div className="bg-background p-4 border border-white/5">
                                                                    <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-2">PÁGINAS</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {b.pages.map((p: string) => (
                                                                            <span key={p} className="text-[8px] bg-white/5 text-neutral-400 px-2 py-1">{p}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {b.features?.length > 0 && (
                                                                <div className="bg-background p-4 border border-white/5">
                                                                    <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-2">FUNCIONALIDADES</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {b.features.map((f: string) => (
                                                                            <span key={f} className="text-[8px] bg-white/5 text-neutral-400 px-2 py-1">{f}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {b.visual_references?.length > 0 && (
                                                                <div className="bg-background p-4 border border-white/5">
                                                                    <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-2">REFERÊNCIAS</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {b.visual_references.map((r: string) => (
                                                                            <span key={r} className="text-[8px] bg-white/5 text-neutral-400 px-2 py-1">{r}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {b.preview_config?.palette && (
                                                            <div>
                                                                <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-3">PALETA DE CORES</p>
                                                                <div className="flex gap-3 flex-wrap">
                                                                    {Object.entries(b.preview_config.palette).map(([name, color]: [string, any]) => (
                                                                        <div key={name} className="flex items-center gap-2">
                                                                            <div className="w-6 h-6 rounded border border-white/10" style={{ backgroundColor: color }} />
                                                                            <span className="text-[9px] text-neutral-500 uppercase">{name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {b.additional_notes && (
                                                            <div className="bg-background p-4 border border-white/5">
                                                                <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-1">NOTAS</p>
                                                                <p className="text-[11px] text-neutral-300 leading-relaxed whitespace-pre-wrap">{b.additional_notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence >
            </main >

            <AnimatePresence>
                {selectedContractProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-surface-container-high border border-white/10 w-full max-w-4xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <FileText className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest">MINUTA DO CONTRATO</h3>
                                        <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest mt-1">
                                            {selectedContractProject.client_owner?.full_name || 'CLIENTE'} · {selectedContractProject.name}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedContractProject(null)}
                                    className="p-2 hover:bg-white/5 text-neutral-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white/5">
                                <div className="max-w-2xl mx-auto bg-white p-12 shadow-inner text-black font-serif text-sm leading-relaxed whitespace-pre-wrap select-text">
                                    {getContractTemplate(selectedContractProject.client_owner || {}, selectedContractProject)}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center gap-4">
                                <p className="text-[9px] text-neutral-600 uppercase font-black tracking-widest leading-relaxed">
                                    ESTA É UMA MINUTA GERADA AUTOMATICAMENTE.<br />
                                    REVISE TODOS OS DADOS ANTES DE ENVIAR.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            const text = getContractTemplate(selectedContractProject.client_owner || {}, selectedContractProject);
                                            navigator.clipboard.writeText(text);
                                            toast.success("Contrato copiado para a área de transferência!");
                                        }}
                                        className="px-6 py-4 border border-white/10 text-white font-black text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all"
                                    >
                                        COPIAR TEXTO
                                    </button>
                                    <button
                                        onClick={() => {
                                            toast.info("Função de exportação PDF em desenvolvimento. Use 'Copiar Texto' por enquanto.");
                                        }}
                                        className="bg-primary text-black px-10 py-4 font-black text-[10px] tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(174,213,0,0.3)]"
                                    >
                                        EXPORTAR PDF
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}

