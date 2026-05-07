import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const pvSurveyResponsesTable = pgTable("pv_survey_responses", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  yearsInvolved: text("years_involved"),
  qualityRating: integer("quality_rating"),
  valuedAspects: text("valued_aspects"),
  challenges: text("challenges"),
  futureConcernLevel: integer("future_concern_level"),
  preservationIdeas: text("preservation_ideas"),
  memberOfOrg: text("member_of_org"),
  comments: text("comments"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PvSurveyResponse = typeof pvSurveyResponsesTable.$inferSelect;
export type InsertPvSurveyResponse = typeof pvSurveyResponsesTable.$inferInsert;
