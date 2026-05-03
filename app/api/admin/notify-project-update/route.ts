import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const { clientEmail, clientName, projectName, status, currentStep } = await req.json();

        if (!clientEmail || !process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: 'Faltam dados essenciais ou chave API.' }, { status: 400 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'Cactus Creative <contact@cactuscreative.cc>',
            to: [clientEmail],
            subject: `Atualização de Projeto // ${projectName}`,
            html: `
                <div style="background-color: #050505; color: #fff; padding: 40px; font-family: sans-serif;">
                    <h1 style="color: #aed500; font-size: 24px; text-transform: uppercase;">ATUALIZAÇÃO DE PROJETO</h1>
                    <p style="color: #999;">Olá ${clientName || 'Cliente'}, o status do seu projeto foi atualizado no portal.</p>
                    <br/>
                    <div style="border-left: 3px solid #aed500; padding-left: 20px;">
                        <p>PROJETO: <b>${projectName}</b></p>
                        <p>NOVO STATUS: <b style="color: #aed500;">${status}</b></p>
                        <p>PROGRESSO GERAL: <b>${currentStep}%</b></p>
                    </div>
                    <br/>
                    <p style="color: #ddd;">Acesse o portal do cliente no site da Cactus para conferir todas as novidades, arquivos e enviar mensagens diretas para a equipe.</p>
                    <br/>
                    <a href="https://cactuscreative.cc/pt/portal" style="display: inline-block; padding: 12px 24px; background-color: #aed500; color: #000; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 2px;">ACESSAR PORTAL</a>
                    <br/><br/><br/>
                    <p style="font-size: 11px; opacity: 0.5;">CACTUS CREATIVE // SYSTEM AUTOMATION</p>
                </div>
            `
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Notify project update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
