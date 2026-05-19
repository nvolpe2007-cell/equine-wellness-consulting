import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const generatedPostsTable = pgTable("generated_posts", {
  id: serial("id").primaryKey(),
  postId: text("post_id").notNull().unique(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  metaDescription: text("meta_description").notNull(),
  body: jsonb("body").notNull().$type<string[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type GeneratedPost = typeof generatedPostsTable.$inferSelect;
export type InsertGeneratedPost = typeof generatedPostsTable.$inferInsert;
