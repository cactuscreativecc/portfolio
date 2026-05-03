import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const { name, email, phone, message, budget, helpOptions, lang } = await req.json();
        const resend = new Resend(process.env.RESEND_API_KEY);
        const isEn = lang === 'en';

        // Validate basic fields
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Lead Alert for Cactus Creative
        const adminEmailPromise = resend.emails.send({
            from: 'Cactus Creative <contact@cactuscreative.cc>',
            to: ['contact@cactuscreative.cc'],
            subject: `Novo Contato: ${name}`,
            replyTo: email,
            html: `
                <div style="background-color: #050505; margin: 0; padding: 0 !important; mso-line-height-rule: exactly; height: 100%; width: 100%; background-color: #050505;">
                    <center style="width: 100%; background-color: #050505;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border: 1px solid #1a1a1a;" bgcolor="#000000">
                            <tr>
                                <td style="padding: 40px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 2px solid #aed500; padding-bottom: 20px; margin-bottom: 40px;">
                                        <tr>
                                            <td>
                                                <div style="font-size: 10px; color: #aed500; font-weight: 800; letter-spacing: 5px; margin-bottom: 5px; text-transform: uppercase;">INCOMING_LEAD // 2026</div>
                                                <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #ffffff; letter-spacing: -1px; text-transform: uppercase;">NOVO CONTATO RECEBIDO</h1>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 40px;">
                                        <tr><td style="font-size: 9px; color: #444444; letter-spacing: 3px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">SOURCE_ID: CLIENT_CONTACT_FORM</td></tr>
                                        <tr>
                                            <td style="border-left: 3px solid #aed500; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase;"><span style="color: #aed500;">NOME:</span> ${name}</p>
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase;"><span style="color: #aed500;">EMAIL:</span> ${email}</p>
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase;"><span style="color: #aed500;">PHONE:</span> ${phone || 'N/A'}</p>
                                                <p style="margin: 10px 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase;"><span style="color: #aed500;">BUDGET:</span> ${budget || 'N/A'}</p>
                                                <p style="margin: 0; font-size: 14px; color: #ffffff; text-transform: uppercase;"><span style="color: #aed500;">PROJECT:</span> ${helpOptions?.join(', ') || 'N/A'}</p>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0c0c0c; border: 1px solid #1a1a1a;" bgcolor="#0c0c0c">
                                        <tr>
                                            <td style="padding: 25px;">
                                                <div style="font-size: 10px; color: #aed500; font-weight: 800; letter-spacing: 3px; margin-bottom: 15px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; text-transform: uppercase;">MESSAGE_CONTENT:</div>
                                                <p style="font-size: 16px; line-height: 1.6; color: #ffffff; margin: 0;">${message}</p>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #1a1a1a;">
                                        <tr><td align="center" style="font-size: 10px; color: #333333; letter-spacing: 2px; text-transform: uppercase;">© 2026 CACTUS CREATIVE ENGINE // OPERATIONAL</td></tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </center>
                </div>
            `,
        });

        // 2. Confirmation Email for the Client
        const clientEmailPromise = resend.emails.send({
            from: 'Cactus Creative <contact@cactuscreative.cc>',
            to: [email],
            subject: isEn ? "We've received your inquiry // Cactus Creative" : "Recebemos sua mensagem // Cactus Creative",
            html: `
                <div style="background-color: #050505; margin: 0; padding: 0 !important; mso-line-height-rule: exactly; height: 100%; width: 100%; background-color: #050505;">
                    <center style="width: 100%; background-color: #050505;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border: 1px solid #1a1a1a;" bgcolor="#000000">
                            <tr>
                                <td style="padding: 40px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 2px solid #aed500; padding-bottom: 20px; margin-bottom: 40px;">
                                        <tr>
                                            <td>
                                                <div style="font-size: 10px; color: #aed500; font-weight: 800; letter-spacing: 5px; margin-bottom: 5px; text-transform: uppercase;">CONFIRMATION // 2026</div>
                                                <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #ffffff; letter-spacing: -1px; text-transform: uppercase;">${isEn ? 'INQUIRY RECEIVED' : 'CONTATO RECEBIDO'}</h1>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="font-size: 16px; line-height: 1.6; color: #ffffff; margin-bottom: 30px;">
                                        ${isEn ? `Hello ${name},` : `Olá ${name},`}<br><br>
                                        ${isEn
                    ? "Thank you for reaching out to Cactus Creative. We have successfully received your project details, and our engineering team is already analyzing your inquiry."
                    : "Obrigado por entrar em contato com a Cactus Creative. Recebemos os detalhes do seu projeto com sucesso e nossa equipe já está analisando as informações."
                }
                                    </p>

                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0c0c0c; border: 1px solid #1a1a1a;" bgcolor="#0c0c0c">
                                        <tr>
                                            <td style="padding: 25px;">
                                                <div style="font-size: 10px; color: #aed500; font-weight: 800; letter-spacing: 3px; margin-bottom: 15px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; text-transform: uppercase;">NEXT_STEPS:</div>
                                                <p style="font-size: 14px; line-height: 1.6; color: #cccccc; margin: 0;">
                                                    ${isEn
                    ? "Technical analysis → Strategic proposal → Alignment meeting. We will contact you within 48 hours."
                    : "Análise técnica → Proposta estratégica → Reunião de alinhamento. Entraremos em contato em até 48 horas."
                }
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #1a1a1a;">
                                        <tr><td align="center" style="font-size: 10px; color: #333333; letter-spacing: 2px; text-transform: uppercase;">© 2026 CACTUS CREATIVE ENGINE // OPERATIONAL</td></tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </center>
                </div>
            `,
        });

        const [adminResult, clientResult] = await Promise.all([adminEmailPromise, clientEmailPromise]);

        if (adminResult.error || clientResult.error) {
            console.error('Resend Error:', adminResult.error || clientResult.error);
            return NextResponse.json({ error: 'Erro ao enviar e-mails' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: { adminResult, clientResult } });
    } catch (error: any) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
