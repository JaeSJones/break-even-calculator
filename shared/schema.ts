import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  workDays: integer("work_days").notNull(),
  rent: real("rent").notNull().default(0),
  supplies: real("supplies").notNull().default(0),
  insurance: real("insurance").notNull().default(0),
  marketing: real("marketing").notNull().default(0),
  taxes: real("taxes").notNull().default(0),
  education: real("education").notNull().default(0),
  miscellaneous: real("miscellaneous").notNull().default(0),
  totalMonthly: real("total_monthly").notNull(),
  dailyBreakEven: real("daily_break_even").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});

export const emailResultsSchema = z.object({
  email: z.string().email(),
  calculationData: z.object({
    workDays: z.number().min(1).max(7),
    expenses: z.record(z.string(), z.number()),
    totalMonthly: z.number(),
    dailyBreakEven: z.number(),
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type EmailResults = z.infer<typeof emailResultsSchema>;
