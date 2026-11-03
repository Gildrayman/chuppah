// i DO: reads a vendor contract (PDF or photos) with Claude and returns structured fields.
// Needs the secret ANTHROPIC_API_KEY (Supabase > Edge Functions > Secrets). Without it, returns {error:"no_key"}.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const CATS = ["אולם וקייטרינג","צילום ווידאו","מוזיקה ודיג'יי","שמלה וחליפה","איפור ושיער","עיצוב ופרחים","הזמנות ומדיה","טבעות","רב ורבנות","בר ואלכוהול","הסעות","שונות"];
const TOOL = {
  name: "save_contract",
  description: "Save the details extracted from a wedding vendor contract or price quote. Use Hebrew for free text. Leave a field empty if it is not in the document; never invent values.",
  input_schema: {
    type: "object",
    properties: {
      vendor_name: { type: "string", description: "Business name of the vendor" },
      category: { type: "string", enum: CATS },
      contact_person: { type: "string" },
      phone: { type: "string" },
      email: { type: "string" },
      address: { type: "string", description: "Vendor or venue address" },
      business_id: { type: "string", description: "ח.פ. / ע.מ. number" },
      total_price: { type: "number", description: "Total price in ILS including VAT. If priced per plate and no total is stated, put 0." },
      price_includes_vat: { type: "boolean" },
      price_per_plate: { type: "number", description: "Price per guest/plate if per-plate pricing" },
      min_guests: { type: "number", description: "Minimum guests/plates committed, if stated" },
      event_date: { type: "string", description: "YYYY-MM-DD" },
      event_time: { type: "string", description: "HH:MM" },
      signed_date: { type: "string", description: "YYYY-MM-DD" },
      is_signed: { type: "boolean", description: "True only if the document shows signatures" },
      payments: { type: "array", items: { type: "object", properties: { label: { type: "string" }, amount: { type: "number" }, due: { type: "string", description: "YYYY-MM-DD or empty" } }, required: ["label","amount"] } },
      included: { type: "array", items: { type: "string" }, description: "What the price includes" },
      terms: { type: "array", items: { type: "string" }, description: "Important commercial terms: cancellation, postponement, overtime, extra costs, price updates, deposit refund, etc. One short sentence each." },
      summary: { type: "string", description: "2-3 sentence Hebrew summary of the deal" }
    },
    required: ["vendor_name","category","payments","terms","summary"]
  }
};
const IMG = new Set(["image/jpeg","image/png","image/webp","image/gif"]);
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "no_key" });
  let body: { files?: { data: string; mime: string }[]; data?: string; mime?: string; today?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }
  const files = (body.files && body.files.length ? body.files : (body.data ? [{ data: body.data, mime: body.mime || "" }] : [])).slice(0, 12);
  if (!files.length) return json({ error: "missing_file" }, 400);
  if (files.reduce((a, f) => a + (f.data?.length || 0), 0) > 14_000_000) return json({ error: "too_big" }, 413);
  const blocks = files.map((f) => f.mime === "application/pdf"
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: f.data } }
    : { type: "image", source: { type: "base64", media_type: IMG.has(f.mime) ? f.mime : "image/jpeg", data: f.data } });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("CONTRACT_MODEL") || "claude-sonnet-5-5",
      max_tokens: 4000,
      tools: [TOOL],
      tool_choice: { type: "tool", name: "save_contract" },
      messages: [{ role: "user", content: [...blocks, { type: "text", text: `אלה עמודים של חוזה (או הצעת מחיר) של ספק לחתונה בישראל. היום ${body.today || ""}. חלץ את כל הפרטים לכלי save_contract. סכומים בשקלים כמספרים. תאריכים בפורמט YYYY-MM-DD. אל תמציא פרטים שלא מופיעים.` }] }]
    })
  });
  const out = await r.json();
  if (!r.ok) return json({ error: "api", status: r.status, detail: out?.error?.message || "" }, 502);
  const use = (out.content || []).find((c: { type: string }) => c.type === "tool_use");
  if (!use) return json({ error: "no_result" }, 502);
  return json({ ok: true, info: use.input });
});
