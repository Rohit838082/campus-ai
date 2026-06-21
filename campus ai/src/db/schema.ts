import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

// Single-user demo profile (seeded on first load)
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  university: varchar("university", { length: 120 }).notNull(),
  course: varchar("course", { length: 120 }).notNull(),
  semester: integer("semester").notNull(),
  streakDays: integer("streak_days").notNull().default(0),
  premiumTier: varchar("premium_tier", { length: 20 }).notNull().default("free"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

// AI Doubt Solver chat history
export const doubts = pgTable("doubts", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 80 }).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  rating: integer("rating"), // +1 thumbs up, -1 thumbs down, null none
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Community notes library
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subject: varchar("subject", { length: 80 }).notNull(),
  semester: integer("semester").notNull(),
  university: varchar("university", { length: 120 }).notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  description: text("description"),
  pageCount: integer("page_count").notNull().default(1),
  likes: integer("likes").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("approved"), // approved / pending / rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Previous year question papers
export const pyqs = pgTable("pyqs", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 120 }).notNull(),
  university: varchar("university", { length: 120 }).notNull(),
  year: integer("year").notNull(),
  paperType: varchar("paper_type", { length: 40 }).notNull(),
  semester: integer("semester").notNull(),
  downloads: integer("downloads").notNull().default(0),
  bookmarked: boolean("bookmarked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Placement company question bank
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(), // IT / Finance / Consulting
  logo: varchar("logo", { length: 10 }).notNull(), // emoji
  practiceCount: integer("practice_count").notNull().default(0),
});

export const companyQuestions = pgTable("company_questions", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  question: text("question").notNull(),
  category: varchar("category", { length: 40 }).notNull(), // Aptitude / Coding / HR / Technical
  difficulty: varchar("difficulty", { length: 10 }).notNull(), // Easy / Med / Hard
  modelAnswer: text("model_answer").notNull(),
  attempts: integer("attempts").notNull().default(0),
});

// Community forum
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 30 }).notNull(), // Doubt / Discussion / Announcement / Resource
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  university: varchar("university", { length: 120 }).notNull(),
  upvotes: integer("upvotes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  tags: text("tags").notNull().default(""), // comma-separated
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Leaderboard
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  rank: integer("rank").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  university: varchar("university", { length: 120 }).notNull(),
  points: integer("points").notNull(),
  badges: integer("badges").notNull().default(0),
  avatar: varchar("avatar", { length: 10 }).notNull(),
});

// Resume builder draft (single row per user)
export const resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull().default(""),
  headline: varchar("headline", { length: 200 }).notNull().default(""),
  email: varchar("email", { length: 160 }).notNull().default(""),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  address: varchar("address", { length: 200 }).notNull().default(""),
  linkedin: varchar("linkedin", { length: 240 }).notNull().default(""),
  github: varchar("github", { length: 240 }).notNull().default(""),
  portfolio: varchar("portfolio", { length: 240 }).notNull().default(""),
  summary: text("summary").notNull().default(""),
  education: text("education").notNull().default(""),
  skills: text("skills").notNull().default(""),
  projects: text("projects").notNull().default(""),
  experience: text("experience").notNull().default(""),
  certificates: text("certificates").notNull().default(""),
  languages: text("languages").notNull().default(""),
  aiScore: integer("ai_score").notNull().default(0),
  aiFeedback: text("ai_feedback").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
