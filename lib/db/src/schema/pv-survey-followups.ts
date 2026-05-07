import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const pvSurveyFollowupsTable = pgTable("pv_survey_followups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PvSurveyFollowup = typeof pvSurveyFollowupsTable.$inferSelect;
export type InsertPvSurveyFollowup = typeof pvSurveyFollowupsTable.$inferInsert;
