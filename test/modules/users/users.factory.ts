import * as Factory from 'factory.ts';
import { faker } from '@faker-js/faker';
import { USERS } from '@drizzle/schema';

export const UsersFactory = Factory.Sync.makeFactory<typeof USERS.$inferInsert>(
  {
    name: faker.person.fullName(),
  },
);
