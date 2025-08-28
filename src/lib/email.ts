// src/lib/email.ts
import nodemailer from 'nodemailer';

let _transporter: nodemailer.Transporter | null = null;

// Evita recrear el transporter en dev con HMR
function getTransporter() {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[email] SMTP no configurado. Se omiten envíos.');
    // Transporter “dummy” que no envía pero no rompe
    _transporter = nodemailer.createTransport({ jsonTransport: true });
    return _transporter;
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,          // true para 465, false para 587
    auth: { user, pass },
    pool: true,                    // pool para múltiples correos
    maxConnections: 3,
    maxMessages: 50,
  });

  return _transporter;
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  bcc?: string | string[];
}) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  const bcc = params.bcc ?? process.env.EMAIL_BCC;

  try {
    const info = await transporter.sendMail({
      from,
      to: params.to,
      bcc,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    if ((transporter as any).options.jsonTransport) {
      console.log('[email] (mock) =>', { to: params.to, subject: params.subject });
    } else {
      console.log('[email] enviado:', info.messageId);
    }
  } catch (e) {
    console.error('[email] error enviando:', e);
  }
}

/* Plantillas simples */
export function tplPagoRecibido(ordenId: string, whatsapp: string) {
  return `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
      <h2>¡Pago recibido!</h2>
      <p>Gracias por tu compra. Tu orden <b>${ordenId}</b> fue recibida correctamente.</p>
      <p>En breve te contactaremos por WhatsApp: <b>${whatsapp}</b>.</p>
      <p>— MT Store</p>
    </div>
  `;
}

export function tplOrdenEntregada(ordenId: string) {
  return `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
      <h2>¡Orden entregada!</h2>
      <p>Tu orden <b>${ordenId}</b> fue <b>entregada</b>. ¡Gracias por elegirnos!</p>
      <p>— MT Store</p>
    </div>
  `;
}
