import * as Factory from 'factory.ts';
import { faker } from '@faker-js/faker';
import { USERS } from '@drizzle/schema';

export const CreateUsersFactory = Factory.Sync.makeFactory<
  typeof USERS.$inferInsert
>({
  name: faker.person.fullName(),
  cityId: null,
});

export const UsersFactory = Factory.Sync.makeFactory<typeof USERS.$inferSelect>(
  {
    id: Factory.each((i) => i),
    name: faker.person.fullName(),
    cityId: faker.number.int(),
  },
);
