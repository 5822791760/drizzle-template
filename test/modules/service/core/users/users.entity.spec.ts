import { UserEntity } from '@app/modules/services/core/users/domain/users.entity';
import { CreateUsersFactory } from '../../../users/users.factory';
import { InsertUSERS } from '../../../../../src/modules/drizzle/schema.type';

const mockUser = CreateUsersFactory.build();

describe('UsersEntity', () => {
  describe('create', () => {
    it('Should create new user entity', () => {
      const res = UserEntity.create(mockUser);

      expect(res).toBeInstanceOf(UserEntity);

      const props = res.getProps();
      expect(props.id).toEqual(null);
      expect(props).toMatchObject(mockUser);
    });
  });

  describe('toDbValues', () => {
    let user: UserEntity;

    beforeAll(() => {
      user = UserEntity.create(mockUser);
    });

    it('should return correct insert data', () => {
      const res = user.toDbValues();

      const expected: InsertUSERS = {
        name: mockUser.name,
        cityId: mockUser.cityId,
      };
      expect(res).toEqual(expected);
    });
  });
});
