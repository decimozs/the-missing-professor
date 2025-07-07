import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

const testTable = sqliteTable("test", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey()
    .notNull(),
  name: text("name").notNull(),
});

export const createTestSchema = createInsertSchema(testTable);
export const updateTestSchema = createTestSchema.partial();

export type Test = typeof testTable.$inferSelect;
export type CreateTest = z.infer<typeof createTestSchema>;
export type UpdateTest = z.infer<typeof updateTestSchema>;

export default testTable;
