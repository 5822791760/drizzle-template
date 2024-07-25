import { TestingModule } from '@nestjs/testing';
import { UsersUsecaseRepo } from '@app/modules/users/usecase/users.usecase.repo';
import { createRepoTestingModule } from '@testcore/utils/repo-test-modules';
import { TestDrizzleService } from '@testcore/utils/test-drizzle.service';
import { USERS } from '@drizzle/schema';
import { UsersFactory } from '../users.factory';

describe('UsersUsecaseRepo', () => {
  let repo: UsersUsecaseRepo;
  let service: TestDrizzleService;

  beforeAll(async () => {
    const module: TestingModule =
      await createRepoTestingModule(UsersUsecaseRepo);

    repo = module.get(UsersUsecaseRepo);
    service = module.get(TestDrizzleService);
  });

  afterAll(async () => {
    await service.end();
  });

  describe('findAll', () => {
    let users: Array<typeof USERS.$inferSelect>;

    beforeEach(async () => {
      users = await repo.findAll();
    });

    it('should be an array', () => {
      expect(users).toBeInstanceOf(Array);
    });

    it('should be empty when no user', async () => {
      expect(users).toEqual([]);
    });

    it('should return users', async () => {
      const testUser = UsersFactory.build({ name: 'bob' });
      await service.insert(USERS, testUser);
      users = await repo.findAll();

      expect(users).toHaveLength(1);
      const user = users[0];
      expect(user.name).toEqual(testUser.name);
    });
  });

  describe('findOne', () => {
    let user: typeof USERS.$inferSelect;

    beforeEach(async () => {
      user = await repo.findOne(1);
    });

    it('should be undefined when no user', () => {
      expect(user).toBeUndefined();
    });

    it('should return user', async () => {
      const testUser = UsersFactory.build({ name: 'bob' });
      const [id] = await service.insert(USERS, testUser);
      user = await repo.findOne(id);

      expect(user).toBeDefined();
      expect(user.name).toEqual(testUser.name);
    });
  });
});
