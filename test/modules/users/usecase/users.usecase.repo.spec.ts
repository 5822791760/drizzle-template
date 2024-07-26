import { TestingModule } from '@nestjs/testing';
import { UsersUsecaseRepo } from '@app/modules/users/usecase/users.usecase.repo';
import { createRepoTestingModule } from '@testcore/utils/test-modules';
import { TestDrizzleService } from '@testcore/utils/test-drizzle.service';
import { USERS } from '@drizzle/schema';
import { CreateUsersFactory } from '../users.factory';
import {
  UsersUsecaseRepoFindAll,
  UsersUsecaseRepoFindOne,
} from '../../../../src/modules/users/usecase/users.usecase.type';
import { UserNotFoundError } from '../../../../src/modules/users/users.error';

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
    let res: UsersUsecaseRepoFindAll;

    beforeEach(async () => {
      res = await repo.findAll();
    });

    it('should be an array', () => {
      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const users = res.unwrap();

      expect(users).toBeInstanceOf(Array);
    });

    it('should be empty when no user', async () => {
      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const users = res.unwrap();
      expect(users).toEqual([]);
    });

    it('should return users', async () => {
      const testUser = CreateUsersFactory.build({ name: 'bob' });
      await service.insert(USERS, testUser);

      res = await repo.findAll();
      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const users = res.unwrap();
      expect(users).toHaveLength(1);
      const user = users[0];
      expect(user.name).toEqual(testUser.name);
    });
  });

  describe('findOne', () => {
    let res: UsersUsecaseRepoFindOne;

    beforeEach(async () => {
      res = await repo.findOne(1);
    });

    it('should error when no user', () => {
      expect(res.isErr()).toEqual(true);
      expect(res.unwrapErr()).toBeInstanceOf(UserNotFoundError);
    });

    it('should return user', async () => {
      const testUser = CreateUsersFactory.build({ name: 'bob' });
      const [id] = await service.insert(USERS, testUser);

      res = await repo.findOne(id);

      expect(res.isErr()).toEqual(false);
      expect(res.isOk()).toEqual(true);

      const user = res.unwrap();
      expect(user).toBeDefined();
      expect(user.name).toEqual(testUser.name);
    });
  });
});
