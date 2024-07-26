import { UsersUsecase } from '@app/modules/users/usecase/users.usecase';
import { TestingModule } from '@nestjs/testing';
import { createServiceTestingModule } from '@testcore/utils/test-modules';
import { UsersUsecaseRepo } from '../../../../src/modules/users/usecase/users.usecase.repo';
import { UsersFactory } from '../users.factory';
import { Err, Ok } from 'oxide.ts';
import { UserNotFoundError } from '../../../../src/modules/users/users.error';
import {
  UsersUsecaseRepoFindAll,
  UsersUsecaseRepoFindOne,
} from '../../../../src/modules/users/usecase/users.usecase.type';

const mockUsers = UsersFactory.buildList(2);
const mockUser = UsersFactory.build();

const mockUsersUsecaseRepo = {
  findAll: jest.fn().mockResolvedValue(Ok(mockUsers)),
  findOne: jest.fn().mockResolvedValue(Ok(mockUser)),
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
    let res: UsersUsecaseRepoFindAll;

    beforeEach(async () => {
      res = await usecase.findAll();
    });

    it('should return empty array if no user found', async () => {
      mockUsersUsecaseRepo.findAll.mockResolvedValueOnce(Ok([]));

      res = await usecase.findAll();
      const users = res.unwrap();
      expect(repo.findAll).toHaveBeenCalled();
      expect(users).toBeInstanceOf(Array);
      expect(users).toEqual([]);
    });

    it('should return an array of users', async () => {
      const users = res.unwrap();
      expect(repo.findAll).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    let res: UsersUsecaseRepoFindOne;

    beforeEach(async () => {
      res = await usecase.findOne(1);
    });

    it('should return a single user', async () => {
      const user = res.unwrap();
      expect(user).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw error when user not found', async () => {
      mockUsersUsecaseRepo.findOne.mockResolvedValueOnce(
        Err(new UserNotFoundError()),
      );

      const res = await usecase.findOne(1);

      expect(res.isErr()).toBe(true);
      expect(res.unwrapErr()).toBeInstanceOf(UserNotFoundError);
    });
  });
});
