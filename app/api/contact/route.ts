import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const { name, email, phone, message, budget, helpOptions } = await req.json();
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Validate basic fields
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Cactus Creative <contact@cactuscreative.cc>', // You should use your verified domain later
            to: ['contact@cactuscreative.cc'],
            subject: `Novo Contato: ${name}`,
            replyTo: email,
            html: `
                <div style="background-color: #050505; margin: 0; padding: 0 !important; mso-line-height-rule: exactly; height: 100%; width: 100%; background-color: #050505;">
                    <center style="width: 100%; background-color: #050505;">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border: 1px solid #1a1a1a;" bgcolor="#000000">
                            <tr>
                                <td style="padding: 40px;">
                                    <!-- Header -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 2px solid #aed500; padding-bottom: 20px; margin-bottom: 40px;">
                                        <tr>
                                            <td>
                                                <div style="font-size: 10px; color: #aed500; font-weight: 800; letter-spacing: 5px; margin-bottom: 5px; text-transform: uppercase;">INCOMING_LEAD // 2026</div>
                                                <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #ffffff; letter-spacing: -1px; text-transform: uppercase;">NOVO CONTATO RECEBIDO</h1>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Data Grid -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 40px;">
                                        <tr>
                                            <td style="font-size: 9px; color: #444444; letter-spacing: 3px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">SOURCE_ID: CLIENT_CONTACT_FORM</td>
                                        </tr>
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

                                    <!-- Message Box -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0c0c0c; border: 1px solid #1a1a1a;" bgcolor="#0c0c0c">
                                        <tr>
                                            <td style="padding: 25px;">
                                                <div style="font-size: 10px; color: #aed500; font-weight: 800; letter-spacing: 3px; margin-bottom: 15px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; text-transform: uppercase;">MESSAGE_CONTENT:</div>
                                                <p style="font-size: 16px; line-height: 1.6; color: #ffffff; margin: 0;">
                                                    ${message}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Footer -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #1a1a1a;">
                                        <tr>
                                            <td align="center" style="font-size: 10px; color: #333333; letter-spacing: 2px; text-transform: uppercase;">
                                                © 2026 CACTUS CREATIVE ENGINE // OPERATIONAL
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                    </center>
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
