import { and, eq, inArray, isNull } from "drizzle-orm";
import {
  db,
  subscribersTable,
  dispatchesTable,
  type Dispatch,
} from "@workspace/db";
import { getUncachableResendClient } from "./resend";
import { buildDispatchEmail } from "./newsletter-emails";
import { logger } from "./logger";

export type SendDispatchResult = {
  ok: boolean;
  sent: number;
  failed: number;
  total: number;
  error?: string;
};

/**
 * Send a persisted dispatch to every active subscriber. Atomically flips the
 * row's status from {draft|scheduled} to "sending" so concurrent callers
 * (e.g. the scheduler racing with a manual "Send now" click) cannot double-send.
 * The status guard in the WHERE clause is what makes this safe: if another
 * process has already claimed the row, our UPDATE matches zero rows and we
 * bail out before sending.
 */
export async function sendDispatch(dispatchId: number): Promise<SendDispatchResult> {
  const claimed = await db
    .update(dispatchesTable)
    .set({ status: "sending", updatedAt: new Date() })
    .where(
      and(
        eq(dispatchesTable.id, dispatchId),
        inArray(dispatchesTable.status, ["draft", "scheduled"]),
      ),
    )
    .returning();

  const dispatch = claimed[0];
  if (!dispatch) {
    return {
      ok: false,
      sent: 0,
      failed: 0,
      total: 0,
      error: "Dispatch is not available to send (already sending, sent, or missing).",
    };
  }

  let resend;
  try {
    resend = await getUncachableResendClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email service unavailable";
    await db
      .update(dispatchesTable)
      .set({ status: "failed", errorMessage: message, updatedAt: new Date() })
      .where(eq(dispatchesTable.id, dispatchId));
    return { ok: false, sent: 0, failed: 0, total: 0, error: message };
  }

  let recipients;
  try {
    recipients = await db
      .select()
      .from(subscribersTable)
      .where(isNull(subscribersTable.unsubscribedAt));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load subscribers";
    await db
      .update(dispatchesTable)
      .set({ status: "failed", errorMessage: message, updatedAt: new Date() })
      .where(eq(dispatchesTable.id, dispatchId));
    return { ok: false, sent: 0, failed: 0, total: 0, error: message };
  }

  let sent = 0;
  let failed = 0;
  for (const sub of recipients) {
    const email = buildDispatchEmail({
      subject: dispatch.subject,
      bodyMarkdown: dispatch.body,
      recipientName: sub.name,
      token: sub.unsubscribeToken,
      ...(dispatch.preheader ? { preheader: dispatch.preheader } : {}),
    });
    try {
      const result = await resend.client.emails.send({
        from: resend.fromEmail,
        to: sub.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      if (result.error) {
        failed += 1;
        logger.error({ err: result.error, email: sub.email }, "dispatch send failed");
      } else {
        sent += 1;
      }
    } catch (err) {
      failed += 1;
      logger.error({ err, email: sub.email }, "dispatch send threw");
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  const total = recipients.length;
  const finalStatus: Dispatch["status"] =
    sent === 0 && failed > 0 ? "failed" : "sent";

  await db
    .update(dispatchesTable)
    .set({
      status: finalStatus,
      sentAt: new Date(),
      sentCount: sent,
      failedCount: failed,
      totalCount: total,
      errorMessage: finalStatus === "failed" ? "All recipients failed" : null,
      updatedAt: new Date(),
    })
    .where(eq(dispatchesTable.id, dispatchId));

  return { ok: finalStatus === "sent", sent, failed, total };
}
