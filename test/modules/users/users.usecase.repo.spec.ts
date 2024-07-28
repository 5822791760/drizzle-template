import { TestingModule } from '@nestjs/testing';
import { createDrizzleRepoTestingModule } from '@testcore/utils/test-modules';
import { TestDrizzleService } from '@testcore/utils/test-drizzle.service';
import { CITIES, USERS } from '@drizzle/schema';
import { CreateUsersFactory } from './users.factory';
import { UserNotFoundError } from '@app/modules/users/users.error';
import { CreateCityFactory } from '../cities/cities.factory';
import { UsersRepo } from '../../../src/modules/users/repo/users.repo';

describe('UsersRepo', () => {
  let repo: UsersRepo;
  let service: TestDrizzleService;

  beforeAll(async () => {
    const module: TestingModule =
      await createDrizzleRepoTestingModule(UsersRepo);

    repo = module.get(UsersRepo);
    service = module.get(TestDrizzleService);
  });

  afterAll(async () => {
    await service.close();
  });

  describe('findAll', () => {
    it('should be an array', async () => {
      const res = await repo.findAll();

      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const users = res.unwrap();

      expect(users).toBeInstanceOf(Array);
    });

    it('should be empty when no user', async () => {
      const res = await repo.findAll();

      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const users = res.unwrap();
      expect(users).toEqual([]);
    });

    it('should return users', async () => {
      const testUser = CreateUsersFactory.build({ name: 'bob' });
      await service.insert(USERS, testUser);

      const res = await repo.findAll();

      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const users = res.unwrap();
      expect(users).toHaveLength(1);
      const user = users[0];
      expect(user.name).toEqual(testUser.name);
    });
  });

  describe('findOne', () => {
    it('should error when no user', async () => {
      const res = await repo.findOne(1);
      expect(res.isErr()).toEqual(true);
      expect(res.unwrapErr()).toBeInstanceOf(UserNotFoundError);
    });

    it('should return user', async () => {
      const testCity = CreateCityFactory.build();
      const [cityId] = await service.insert(CITIES, testCity);
      const testUser = CreateUsersFactory.build({ cityId });
      const [id] = await service.insert(USERS, testUser);

      const res = await repo.findOne(id);

      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const user = res.unwrap();
      expect(user).toBeDefined();
      expect(user.name).toEqual(testUser.name);
    });
  });
});
