import { serial, pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const USERS = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  cityId: integer('city_id').references(() => CITIES.id),
});

export const COUNTRIES = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const CITIES = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => COUNTRIES.id),
});
