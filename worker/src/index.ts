/**
 * AI Governance Reminder — Cloudflare Worker
 *
 * Receives a reminder registration from the desktop app and schedules
 * a single email via Resend at the user's chosen interval (30/60/90 days).
 *
 * Environment secrets (set via `wrangler secret put <NAME>`):
 *   RESEND_API_KEY  — your Resend API key (https://resend.com/api-keys)
 *
 * Endpoint:
 *   POST /schedule-reminder
 *   Body: { email: string, reminderDays: 30|60|90, deepLinkPath: string }
 */

export interface Env {
  RESEND_API_KEY: string;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function buildEmailHtml(reminderDays: number, deepLinkPath: string): string {
  const dayLabel = `${reminderDays}-Day`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Governance Check-In</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1E2761;padding:28px 36px;">
              <p style="margin:0;color:#CADCFC;font-size:12px;letter-spacing:1px;text-transform:uppercase;">AI Governance Tool</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">${dayLabel} Governance Check-In</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
                It's been <strong>${reminderDays} days</strong> since your AI governance assessment.
                Governance gaps widen over time — now is a good moment to check your mitigation
                progress and update your tracker.
              </p>
              <p style="margin:0 0 28px;color:#374151;font-size:15px;line-height:1.6;">
                Open your AI Governance Tool to:
              </p>
              <ul style="margin:0 0 28px;padding-left:20px;color:#374151;font-size:15px;line-height:1.8;">
                <li>Review open mitigation items and mark completed actions</li>
                <li>Update your spend tracker with the latest AI tool costs</li>
                <li>Recalculate your ROI with current adoption data</li>
              </ul>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#1E2761;">
                    <a href="${deepLinkPath}"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Open Track Progress →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;color:#9CA3AF;font-size:12px;line-height:1.5;">
                If the button above doesn't work, open the AI Governance Tool app on your computer
                and navigate to the <strong>Track Progress</strong> tab.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 36px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.5;">
                You're receiving this because you requested a ${reminderDays}-day governance reminder
                in the AI Governance Tool. This is a one-time reminder — no further emails will be
                sent unless you request them.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname !== '/schedule-reminder') {
      return json({ error: 'Not found' }, 404);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    // Parse and validate body
    let body: { email?: unknown; reminderDays?: unknown; deepLinkPath?: unknown };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const { email, reminderDays, deepLinkPath } = body;

    if (
      typeof email !== 'string' ||
      !email.includes('@') ||
      ![30, 60, 90].includes(reminderDays as number) ||
      typeof deepLinkPath !== 'string'
    ) {
      return json({ error: 'Missing or invalid fields: email, reminderDays (30|60|90), deepLinkPath' }, 400);
    }

    if (!env.RESEND_API_KEY) {
      console.error('[worker] RESEND_API_KEY secret not configured');
      return json({ error: 'Server misconfiguration' }, 500);
    }

    // Schedule the email at now + reminderDays
    const sendAt = new Date();
    sendAt.setDate(sendAt.getDate() + (reminderDays as number));

    const emailPayload = {
      from: 'AI Governance Tool <onboarding@resend.dev>',
      to: [email as string],
      subject: `${reminderDays}-Day AI Governance Check-In`,
      html: buildEmailHtml(reminderDays as number, deepLinkPath as string),
      scheduled_at: sendAt.toISOString(),
    };

    let resendRes: Response;
    try {
      resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });
    } catch (err) {
      console.error('[worker] Resend network error:', err);
      return json({ error: 'Failed to reach email service' }, 502);
    }

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('[worker] Resend API error', resendRes.status, errText);
      return json({ error: 'Email scheduling failed' }, 502);
    }

    const result = await resendRes.json();
    return json({ ok: true, emailId: (result as { id?: string }).id });
  },
};
