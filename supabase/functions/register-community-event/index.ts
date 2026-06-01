import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

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
    const { name, email, event_id, event_date, user_id } = await req.json();

    if (!name || !email || !event_id || !event_date) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Obtener datos del evento incluyendo el meeting_url
    const { data: event, error: eventError } = await supabase
      .from("community_events")
      .select("title, meeting_url")
      .eq("id", event_id)
      .single();

    if (eventError) throw new Error(`Evento no encontrado: ${eventError.message}`);

    // 2. Insertar registro
    const { error: dbError } = await supabase
      .from("community_registrations")
      .insert({ email, name, event_id, event_date, user_id });

    if (dbError) throw new Error(`DB: ${dbError.message}`);

    const eventMs = new Date(event_date).getTime();
    
    // Configuración para Uruguay (America/Montevideo)
    const localeOptions: Intl.DateTimeFormatOptions = { 
      timeZone: "America/Montevideo",
      hour12: false 
    };

    const eventDateFormatted = new Date(event_date).toLocaleDateString("es-UY", { 
      ...localeOptions, 
      dateStyle: "long" 
    });
    
    const eventTimeFormatted = new Date(event_date).toLocaleTimeString("es-UY", { 
      ...localeOptions,
      hour: "2-digit", 
      minute: "2-digit" 
    });

    const meetButtonHtml = event.meeting_url 
      ? `<div style="text-align: center; margin: 32px 0;">
           <a href="${event.meeting_url}" style="background-color: #CAFE5B; color: #010101; padding: 14px 28px; font-weight: bold; border-radius: 50px; text-decoration: none; display: inline-block; font-size: 14px; letter-spacing: 0.5px;">Unirse a Google Meet</a>
         </div>`
      : "";

    // Mail 1: Confirmación inmediata
    await sendViaResend({
      from: "Polarist <contacto@polarist.app>",
      to: [email],
      subject: "✅ Registro confirmado",
      html: getEmailTemplate(
        "Registro confirmado",
        `<p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
         <p>Tu registro para el evento <strong>${event.title}</strong> fue confirmado con éxito.</p>
         
         <div style="background-color: #0c0c0c; border: 1px solid #1a1a1a; padding: 20px; border-radius: 16px; margin: 24px 0;">
           <p style="margin: 0 0 8px 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">Cuándo</p>
           <p style="margin: 0; font-size: 16px; font-weight: bold; color: #CAFE5B;">${eventDateFormatted} a las ${eventTimeFormatted} HS</p>
         </div>
         
         <p>Agendá la fecha en tu calendario. Te compartimos el link de acceso para que ya lo tengas a mano:</p>
         ${meetButtonHtml}
         
         <p style="margin-bottom: 0;">Nos vemos pronto,<br>— El equipo de Polarist</p>`
      ),
    });

    // Mail 2: Recordatorio 24 h antes
    const reminder24hAt = new Date(eventMs - 24 * 60 * 60 * 1000).toISOString();
    // Solo programar si el momento de envío está en el futuro
    if (new Date(reminder24hAt).getTime() > Date.now()) {
      await sendViaResend({
        from: "Polarist <contacto@polarist.app>",
        to: [email],
        subject: "⏰ Tu evento es mañana",
        html: getEmailTemplate(
          "Tu evento es mañana",
          `<p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
           <p>Falta muy poco. Mañana a las <strong>${eventTimeFormatted} HS</strong> nos encontramos en <strong>${event.title}</strong>.</p>
           
           <p>Te sugerimos ingresar unos minutos antes para verificar tu conexión. Podés acceder directamente haciendo clic acá:</p>
           ${meetButtonHtml}
           
           <p style="margin-bottom: 0;">¡Te esperamos!<br>— El equipo de Polarist</p>`
        ),
        scheduled_at: reminder24hAt,
      });
    }

    // Mail 3: Recordatorio el mismo día (1 hora antes)
    const reminder1hAt = new Date(eventMs - 60 * 60 * 1000).toISOString();
    // Solo programar si el momento de envío está en el futuro
    if (new Date(reminder1hAt).getTime() > Date.now()) {
      await sendViaResend({
        from: "Polarist <contacto@polarist.app>",
        to: [email],
        subject: `⚡ En 1 hora comienza: ${event.title}`,
        html: getEmailTemplate(
          "El evento comienza en 1 hora",
          `<p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
           <p>¡Preparate un café! En una hora exacta (a las <strong>${eventTimeFormatted} HS</strong>) empieza <strong>${event.title}</strong>.</p>
           
           <p>Ya estamos preparando la sala. Unite a la videollamada a través de este enlace:</p>
           ${meetButtonHtml}
           
           <p style="margin-bottom: 0;">¡Nos vemos en un rato!<br>— El equipo de Polarist</p>`
        ),
        scheduled_at: reminder1hAt,
      });
    }

    // Mail 4: Recordatorio el mismo día (5 minutos antes)
    const reminder5mAt = new Date(eventMs - 5 * 60 * 1000).toISOString();
    // Solo programar si el momento de envío está en el futuro
    if (new Date(reminder5mAt).getTime() > Date.now()) {
      await sendViaResend({
        from: "Polarist <contacto@polarist.app>",
        to: [email],
        subject: `🚨 En 5 minutos comienza: ${event.title}`,
        html: getEmailTemplate(
          "El evento comienza en 5 minutos",
          `<p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
           <p>¡Ya casi empezamos! En 5 minutos damos inicio a <strong>${event.title}</strong>.</p>
           
           <p>Unite a la videollamada a través de este enlace directo:</p>
           ${meetButtonHtml}
           
           <p style="margin-bottom: 0;">¡Nos vemos en un instante!<br>— El equipo de Polarist</p>`
        ),
        scheduled_at: reminder5mAt,
      });
    }

    // Notificación interna
    await sendViaResend({
      from: "Polarist <contacto@polarist.app>",
      to: ["contactopolarist@gmail.com"],
      subject: `Nuevo registro: ${name}`,
      html: `<p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Evento:</strong> ${event.title}</p>
             <p><strong>Fecha:</strong> ${eventDateFormatted} ${eventTimeFormatted} HS (Uruguay)</p>`,
    });

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } },
    );
  }
});
