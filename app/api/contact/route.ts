import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, phone, message, budget, helpOptions } = await req.json();

        // Validate basic fields
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Cactus Creative <onboarding@resend.dev>', // You should use your verified domain later
            to: ['contact@cactuscreative.cc'],
            subject: `Novo Contato: ${name}`,
            replyTo: email,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border: 1px solid #1a1a1a;">
                    <h2 style="color: #aed500; text-transform: uppercase; letter-spacing: 2px;">Novo Lead de Contato</h2>
                    <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
                    
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
                    <p><strong>Budget Estimado:</strong> ${budget || 'Não selecionado'}</p>
                    <p><strong>Interesses / Serviços:</strong> ${helpOptions?.join(', ') || 'Não selecionado'}</p>
                    
                    <div style="background-color: #111; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p style="margin-top: 0;"><strong>Mensagem:</strong></p>
                        <p style="line-height: 1.6; color: #ccc;">${message}</p>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #666; text-align: center;">Cactus Creative - Sistema de Gerenciamento de Leads</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
