import { UsersUsecase } from '@app/modules/users/usecase/users.usecase';
import { TestingModule } from '@nestjs/testing';
import { createServiceTestingModule } from '@testcore/utils/test-modules';
import { UsersUsecaseRepo } from '@app/modules/users/usecase/users.usecase.repo';
import { UsersFactory } from '../users.factory';
import { Err, Ok } from 'oxide.ts';
import { UserNotFoundError } from '@app/modules/users/users.error';
import { CitiesFactory } from '../../cities/cities.factory';
import { UsersUsecaseRepoFindOne } from '../../../../src/modules/users/user.type';

const mockUsersUsecaseRepo = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('UserUsecase', () => {
  let usecase: UsersUsecase;
  let repo: UsersUsecaseRepo;

  beforeAll(async () => {
    const module: TestingModule = await createServiceTestingModule(
      UsersUsecase,
      UsersUsecaseRepo,
      mockUsersUsecaseRepo,
    );

    usecase = module.get(UsersUsecase);
    repo = module.get(UsersUsecaseRepo);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('findAll', () => {
    it('should return empty array if no user found', async () => {
      mockUsersUsecaseRepo.findAll.mockResolvedValue(Ok([]));

      const res = await usecase.findAll();
      expect(res.isErr()).toBe(false);

      const users = res.unwrap();
      expect(repo.findAll).toHaveBeenCalled();
      expect(users).toBeInstanceOf(Array);
      expect(users).toEqual([]);
    });

    it('should return an array of users', async () => {
      const mockUsers = UsersFactory.buildList(2);
      mockUsersUsecaseRepo.findAll.mockResolvedValue(Ok(mockUsers));

      const res = await usecase.findAll();

      const users = res.unwrap();
      expect(repo.findAll).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    const id = 1;

    it('should return a single user', async () => {
      const mockUser = UsersFactory.build();
      const mockCity = CitiesFactory.build();

      const mockData: UsersUsecaseRepoFindOne = {
        id: mockUser.id,
        name: mockUser.name,
        city: {
          id: mockCity.id,
          name: mockCity.name,
        },
      };
      mockUsersUsecaseRepo.findOne.mockResolvedValue(Ok(mockData));

      const res = await usecase.findOne(id);

      expect(res.isErr()).toBe(false);
      const user = res.unwrap();
      expect(user).toEqual(mockData);
      expect(repo.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw error when user not found', async () => {
      mockUsersUsecaseRepo.findOne.mockResolvedValue(
        Err(new UserNotFoundError()),
      );

      const res = await usecase.findOne(id);

      expect(res.isErr()).toBe(true);
      expect(res.unwrapErr()).toBeInstanceOf(UserNotFoundError);
    });
  });
});
