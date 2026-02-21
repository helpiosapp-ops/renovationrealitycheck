import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomType: text('room_type').notNull(),
  scenarios: jsonb('scenarios').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
