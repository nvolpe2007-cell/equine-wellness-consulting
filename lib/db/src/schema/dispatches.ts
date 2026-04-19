import { pgTable, serial, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";

export const dispatchStatuses = ["draft", "scheduled", "sending", "sent", "failed"] as const;
export type DispatchStatus = (typeof dispatchStatuses)[number];

export const dispatchesTable = pgTable("dispatches", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  preheader: text("preheader"),
  body: text("body").notNull(),
  status: varchar("status", { length: 16 }).notNull().default("draft").$type<DispatchStatus>(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  sentCount: integer("sent_count").notNull().default(0),
  failedCount: integer("failed_count").notNull().default(0),
  totalCount: integer("total_count").notNull().default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Dispatch = typeof dispatchesTable.$inferSelect;
export type InsertDispatch = typeof dispatchesTable.$inferInsert;
