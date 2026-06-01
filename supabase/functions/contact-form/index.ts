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

// Helper para generar plantillas de email consistentes con la estética Polarist
function getEmailTemplate(title: string, contentHtml: string) {
  return `
    <div style="background-color: #010101; color: #F6F6F6; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; border-radius: 24px; max-width: 580px; margin: 0 auto; border: 1px solid #1a1a1a;">

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #F6F6F6;">POLARIST</span>
      </div>

      <!-- Contenido -->
      <div style="font-size: 16px; line-height: 1.6; color: #F6F6F6;">
        ${contentHtml}
      </div>

      <!-- Footer: banner clickeable -->
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

      <!-- Créditos -->
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
        "Access-Control-Allow-Headers": "content-type, authorization",
      },
    });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Enviar notificación interna a Enzo (Gmail)
    await sendViaResend({
      from: "Polarist <contacto@polarist.app>",
      to: ["contactopolarist@gmail.com"],
      subject: `📩 Nuevo contacto: ${name}`,
      html: getEmailTemplate(
        "Nuevo mensaje de contacto",
        `<p style="margin-top: 0;">Recibiste un nuevo mensaje a través del formulario de la web:</p>
         
         <div style="background-color: #0c0c0c; border: 1px solid #1a1a1a; padding: 20px; border-radius: 16px; margin: 24px 0;">
           <p style="margin: 0 0 8px 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">De</p>
           <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: bold; color: #CAFE5B;">${name} (${email})</p>
           
           <p style="margin: 0 0 8px 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">Mensaje</p>
           <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #F6F6F6; white-space: pre-wrap;">${message}</p>
         </div>`
      ),
    });

    // 2. Enviar respuesta automática de cortesía al usuario
    try {
      await sendViaResend({
        from: "Polarist <contacto@polarist.app>",
        to: [email],
        subject: "Recibimos tu mensaje - Polarist",
        html: getEmailTemplate(
          "Recibimos tu mensaje",
          `<p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
           <p>Muchas gracias por ponerte en contacto con nosotros.</p>
           <p>Confirmamos que recibimos tu mensaje correctamente. Nuestro equipo lo está revisando y te responderemos por esta vía en menos de 24 horas.</p>
           <p style="margin-top: 24px; margin-bottom: 0;">Saludos,<br>— El equipo de Polarist</p>`
        ),
      });
    } catch (confirmErr) {
      console.error("Error al enviar confirmación al usuario:", confirmErr);
    }

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
