type EmailRequestBody = {
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
};

const jsonResponse = (res: any, statusCode: number, payload: Record<string, unknown>) => {
  res.status(statusCode).setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(payload));
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return jsonResponse(res, 405, { ok: false, error: "Method not allowed." });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "TMM Project <onboarding@resend.dev>";

  if (!resendApiKey) {
    return jsonResponse(res, 500, {
      ok: false,
      error: "RESEND_API_KEY is missing. Configure it in Vercel environment variables."
    });
  }

  let body: EmailRequestBody = {};
  try {
    body = typeof req.body === "string" ? (JSON.parse(req.body) as EmailRequestBody) : ((req.body ?? {}) as EmailRequestBody);
  } catch {
    return jsonResponse(res, 400, { ok: false, error: "Invalid JSON body." });
  }

  const to = typeof body.to === "string" ? body.to.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const html = typeof body.html === "string" ? body.html : "";

  if (!to || !subject || (!text && !html)) {
    return jsonResponse(res, 400, { ok: false, error: "Required fields: to, subject, and text/html." });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: text || undefined,
      html: html || undefined
    })
  });

  const payload = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!response.ok) {
    return jsonResponse(res, 500, {
      ok: false,
      error: payload?.message || "Failed to send email from provider."
    });
  }

  return jsonResponse(res, 200, { ok: true, id: payload.id || null });
}
