import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const APP_URL = "https://polarist.app";
const FROM_EMAIL = "Polarist <contactopolarist@gmail.com>";

// ─── Resend helper ────────────────────────────────────────────────────────────
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

// ─── Types ────────────────────────────────────────────────────────────────────
type NewsItem = {
  image_url: string | null;
  title: string;
  body_text: string;
  cta_label: string;
  cta_url: string | null;
  sort_order: number;
};

type Edition = {
  hero_image_url: string;
  hero_title: string;
  hero_subtitle: string | null;
  intro_text: string | null;
};

// ─── Template helpers ─────────────────────────────────────────────────────────
const ctaBtn = (label: string, url: string) =>
  `<a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 18px;background:#CAFE5B;color:#010101;font-weight:700;font-size:11px;letter-spacing:0.8px;border-radius:50px;text-decoration:none;text-transform:uppercase;">${label}</a>`;

// Item 1 — FEATURED: full-width image + title + short description + CTA
function featuredItem(item: NewsItem): string {
  const img = item.image_url
    ? `<img src="${item.image_url}" alt="${item.title}" width="622" style="width:100%;max-width:622px;height:260px;object-fit:cover;display:block;border-radius:10px 10px 0 0;" />`
    : "";
  const cta = item.cta_url ? `<div style="margin-top:14px;">${ctaBtn(item.cta_label, item.cta_url)}</div>` : "";
  return `
    <div style="margin-bottom:12px;">
      ${img}
      <div style="background:#111111;border-radius:0 0 10px 10px;padding:18px 20px 20px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:2px;color:#CAFE5B;text-transform:uppercase;">Destacado</p>
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#F6F6F6;line-height:1.25;letter-spacing:-0.4px;">${item.title}</h2>
        <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(246,246,246,0.65);">${item.body_text}</p>
        ${cta}
      </div>
    </div>`;
}

// Items 2, 3, 4 — SMALL: 3 compact columns side by side (table-based for email compatibility)
function smallItemsRow(items: NewsItem[]): string {
  const cells = items.slice(0, 3).map((item, i) => {
    const img = item.image_url
      ? `<img src="${item.image_url}" alt="${item.title}" width="194" style="width:100%;height:110px;object-fit:cover;display:block;border-radius:8px 8px 0 0;" />`
      : "";
    const cta = item.cta_url
      ? `<div style="margin-top:10px;">${ctaBtn(item.cta_label, item.cta_url)}</div>`
      : "";
    const padLeft = i === 0 ? "0" : "6px";
    const padRight = i === 2 ? "0" : "6px";
    return `
      <td width="33%" valign="top" style="padding-left:${padLeft};padding-right:${padRight};">
        <div style="background:#111111;border-radius:8px;overflow:hidden;">
          ${img}
          <div style="padding:12px;">
            <h3 style="margin:0 0 5px;font-size:13px;font-weight:700;color:#F6F6F6;line-height:1.3;">${item.title}</h3>
            <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(246,246,246,0.55);">${item.body_text}</p>
            ${cta}
          </div>
        </div>
      </td>`;
  }).join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
      <tr>${cells}</tr>
    </table>`;
}

// Item 5 — MEDIUM: image left (40%) + text right (60%)
function mediumItem(item: NewsItem): string {
  const img = item.image_url
    ? `<td width="38%" valign="top" style="padding-right:14px;">
         <img src="${item.image_url}" alt="${item.title}" width="236" style="width:100%;height:130px;object-fit:cover;display:block;border-radius:8px;" />
       </td>`
    : "";
  const textWidth = item.image_url ? "62%" : "100%";
  const cta = item.cta_url ? `<div style="margin-top:10px;">${ctaBtn(item.cta_label, item.cta_url)}</div>` : "";
  return `
    <div style="margin-bottom:12px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${img}
          <td width="${textWidth}" valign="middle" style="background:#111111;border-radius:${item.image_url ? "0 8px 8px 0" : "8px"};padding:14px 16px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:1.5px;color:rgba(202,254,91,0.7);text-transform:uppercase;">También</p>
            <h3 style="margin:0 0 6px;font-size:15px;font-weight:700;color:#F6F6F6;line-height:1.3;">${item.title}</h3>
            <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(246,246,246,0.6);">${item.body_text}</p>
            ${cta}
          </td>
        </tr>
      </table>
    </div>`;
}

// ─── Main render ──────────────────────────────────────────────────────────────
function renderNewsletterHtml(edition: Edition, newsItems: NewsItem[]): string {
  const [item1, item2, item3, item4, item5] = newsItems;
  const smallItems = [item2, item3, item4].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Polarist — Radar de IA</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:650px;margin:0 auto;padding:20px 14px 40px;">

    <!-- ── Header Banner ────────────────────────────────────────────────── -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
      <tr>
        <td align="center">
          <a href="${APP_URL}" style="text-decoration:none;display:block;">
            <img src="https://epoolgyzovefaofyvocz.supabase.co/storage/v1/object/public/assets/Polarist.png" alt="Polarist" width="622" style="width:100%;max-width:622px;height:auto;display:block;border:none;margin:0 auto;" />
          </a>
        </td>
      </tr>
    </table>

    <!-- ── Minimal Title ────────────────────────────────────────────────── -->
    <div style="text-align:center;margin:24px 0 20px;">
      <h1 style="margin:0;font-size:20px;font-weight:800;letter-spacing:1px;color:#F6F6F6;text-transform:uppercase;">Las últimas noticias de la semana</h1>
    </div>

    <!-- ── Divider ──────────────────────────────────────────────────────── -->
    <div style="margin-bottom:16px;">
      <div style="height:1px;background:linear-gradient(to right, #CAFE5B 0%, transparent 100%);"></div>
    </div>

    <!-- ── Item 1: FEATURED ─────────────────────────────────────────────── -->
    ${item1 ? featuredItem(item1) : ""}

    <!-- ── Items 2-4: SMALL 3-COL ───────────────────────────────────────── -->
    ${smallItems.length > 0 ? smallItemsRow(smallItems) : ""}

    <!-- ── Item 5: MEDIUM ───────────────────────────────────────────────── -->
    ${item5 ? mediumItem(item5) : ""}

    <!-- ── Footer ───────────────────────────────────────────────────────── -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1a1a1a;margin-top:8px;">
      <p style="margin:0 0 4px;font-size:10px;color:rgba(246,246,246,0.2);">Recib&iacute;s este email porque est&aacute;s suscripto al newsletter de Polarist.</p>
      <p style="margin:0 0 10px;font-size:10px;color:rgba(246,246,246,0.2);">&#169; 2026 Polarist. Tu camino m&aacute;s f&aacute;cil hacia la IA.</p>
      <a href="${APP_URL}/settings" style="font-size:10px;color:rgba(202,254,91,0.5);text-decoration:underline;">Gestionar suscripci&oacute;n</a>
    </div>

  </div>
</body>
</html>`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
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
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Buscar edición programada lista para enviar
    const { data: edition, error: editionError } = await supabase
      .from("newsletter_editions")
      .select("id, subject, hero_image_url, hero_title, hero_subtitle, intro_text")
      .eq("status", "scheduled")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (editionError) throw new Error(`Error buscando edición: ${editionError.message}`);

    if (!edition) {
      return new Response(
        JSON.stringify({ ok: true, message: "No hay ediciones programadas para enviar." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Cargar las noticias (máx 5)
    const { data: newsItems, error: newsError } = await supabase
      .from("newsletter_news_items")
      .select("image_url, title, body_text, cta_label, cta_url, sort_order")
      .eq("edition_id", edition.id)
      .order("sort_order", { ascending: true })
      .limit(5);

    if (newsError) throw new Error(`Error cargando noticias: ${newsError.message}`);
    if (!newsItems || newsItems.length === 0) {
      throw new Error(`La edición ${edition.id} no tiene noticias cargadas.`);
    }

    // 3. Obtener suscriptores activos
    const { data: subscribers, error: subsError } = await supabase
      .from("polarist_usuarios")
      .select("email, full_name")
      .eq("newsletter_subscribed", true)
      .not("email", "is", null);

    if (subsError) throw new Error(`Error obteniendo suscriptores: ${subsError.message}`);

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "No hay suscriptores activos." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Renderizar HTML
    const html = renderNewsletterHtml(edition, newsItems);

    // 5. Enviar a cada suscriptor
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      if (!sub.email) continue;
      try {
        await sendViaResend({
          from: FROM_EMAIL,
          to: [sub.email],
          subject: edition.subject,
          html,
        });
        sent++;
      } catch (err) {
        failed++;
        const msg = err instanceof Error ? err.message : "error desconocido";
        errors.push(`${sub.email}: ${msg}`);
        console.error(`Error enviando a ${sub.email}:`, msg);
      }
    }

    // 6. Marcar edición como enviada
    await supabase
      .from("newsletter_editions")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", edition.id);

    return new Response(
      JSON.stringify({
        ok: true,
        edition_id: edition.id,
        subject: edition.subject,
        subscribers_total: subscribers.length,
        sent,
        failed,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );

  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("send-weekly-newsletter error:", message);
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
