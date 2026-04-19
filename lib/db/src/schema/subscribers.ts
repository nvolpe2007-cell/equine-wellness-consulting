import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// `unsubscribe_token` has a SQL DEFAULT (encode(gen_random_bytes(24),'hex'))
// applied to the live database; routes also generate a fresh token on insert.
export const subscribersTable = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name").notNull(),
  source: text("source").notNull().default("news_page"),
  unsubscribeToken: varchar("unsubscribe_token", { length: 64 }).notNull().unique(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Subscriber = typeof subscribersTable.$inferSelect;
export type InsertSubscriber = typeof subscribersTable.$inferInsert;
