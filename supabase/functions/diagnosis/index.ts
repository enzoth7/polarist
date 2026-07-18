import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

async function sendViaResend(payload: object) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }
  return res.json();
}

function getEmailTemplate(title: string, contentHtml: string) {
  return `
    <div style="background-color: #010101; color: #F6F6F6; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; border-radius: 24px; max-width: 580px; margin: 0 auto; border: 1px solid #1a1a1a;">
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #F6F6F6;">POLARIST</span>
      </div>
      <div style="font-size: 16px; line-height: 1.6; color: #F6F6F6;">
        ${contentHtml}
      </div>
      <div style="margin-top: 32px;">
        <a href="https://polarist.app" style="text-decoration: none; display: block;">
          <img
            src="https://epoolgyzovefaofyvocz.supabase.co/storage/v1/object/public/assets/Polarist.png"
            alt="Polarist — www.polarist.app"
            width="580"
            style="width: 100%; max-width: 580px; border-radius: 16px; display: block;"
          />
        </a>
      </div>
      <div style="padding-top: 20px; text-align: center;">
        <p style="font-size: 12px; color: #666666; margin: 0;">© 2026 Polarist. Todos los derechos reservados.</p>
        <p style="font-size: 12px; color: #666666; margin: 4px 0 0 0;">Tu camino más fácil hacia la IA.</p>
      </div>
    </div>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
      },
    });
  }

  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send the confirmation email to the user (no PDF attachment)
    await sendViaResend({
      from: "Polarist <contacto@polarist.app>",
      to: [email],
      subject: "Recibimos tu solicitud de diagnóstico — Polarist",
      html: getEmailTemplate(
        "Confirmación de Diagnóstico",
        `<p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
         <p>Recibimos tu solicitud de diagnóstico para nuestras asesorías de IA y ya nos pusimos a trabajar en ella.</p>
         <p>Nuestro equipo la estará evaluando detalladamente para preparar una devolución personalizada para tu caso. Muy pronto nos pondremos en contacto con vos para contarte los siguientes pasos.</p>
         <p>Gracias por tu interés y por confiar en Polarist.</p>
         <p style="margin-top: 24px; margin-bottom: 0;">Saludos,<br>— El equipo de Polarist</p>`
      )
    });

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
