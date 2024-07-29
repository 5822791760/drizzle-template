import { UsersService } from '@services/core/users/users.service';
import { createServiceTestingModule } from '@testcore/utils/test-modules';
import { TestDrizzleService } from '@testcore/utils/test-drizzle.service';
import { CreateUsersFactory } from '@testcore/factories/users.factory';
import { USERS } from '@drizzle/schema';
import { UserEntity } from '@services/core/users/domain/users.entity';
import { UserNotFoundError } from '@app/modules/users/users.error';

describe('UsersService', () => {
  let service: UsersService;
  let drizzle: TestDrizzleService;

  beforeAll(async () => {
    const module = await createServiceTestingModule(UsersService);

    service = module.get(UsersService);
    drizzle = module.get(TestDrizzleService);
  });

  afterAll(async () => {
    await drizzle.close();
  });

  describe('getById', () => {
    beforeEach(async () => {
      drizzle.cleanTables(USERS);
    });

    it('Should return UsersEntity', async () => {
      const mockUser = CreateUsersFactory.build();
      const [id] = await drizzle.insert(USERS, mockUser);

      const res = await service.getById(id);

      expect(res.isErr()).toEqual(false);

      const user = res.unwrap();
      expect(user).toBeInstanceOf(UserEntity);

      const props = user.getProps();
      expect(props).toMatchObject(mockUser);
    });

    it('Should return error if not found', async () => {
      const res = await service.getById(9999);

      expect(res.isErr()).toEqual(true);
      expect(res.unwrapErr()).toBeInstanceOf(UserNotFoundError);
    });
  });
});
