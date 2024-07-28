import { CITIES, USERS } from './schema';

export type InsertUSERS = typeof USERS.$inferInsert;
export type SelectUSERS = typeof USERS.$inferSelect;
export type InsertCITIES = typeof CITIES.$inferInsert;
export type SelectCITIES = typeof CITIES.$inferSelect;
