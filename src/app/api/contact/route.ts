import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schema";
import { checkRateLimit } from "@/lib/rateLimit";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(request: NextRequest) {
  // Extract real client IP (Caddy sets X-Forwarded-For)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  const { allowed, resetAt } = checkRateLimit(ip);

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: "Too many requests. Please wait before sending another message.",
        retryAfter,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: result.error.issues },
      { status: 422 }
    );
  }

  const { name, email, message } = result.data;
  const emailEnabled = process.env.EMAIL_ENABLED !== "false";

  if (!emailEnabled) {
    // Dev mode - log instead of sending
    console.log("[contact] Email sending disabled (EMAIL_ENABLED=false)");
    console.log(`[contact] From: ${name} <${email}>`);
    console.log(`[contact] Message: ${message}`);
    return NextResponse.json({ success: true });
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = process.env.RESEND_TO_EMAIL;

  if (!toEmail) {
    console.error("[contact] RESEND_TO_EMAIL is not set");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: `Portfolio Contact <${fromEmail}>`,
    to: [toEmail],
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
