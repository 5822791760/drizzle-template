import { UsersUsecase } from '@app/modules/users/usecase/users.usecase';
import { TestingModule } from '@nestjs/testing';
import { createServiceTestingModule } from '@testcore/utils/test-modules';
import { UsersUsecaseRepo } from '../../../../src/modules/users/usecase/users.usecase.repo';
import { UsersFactory } from '../users.factory';

const mockUsers = UsersFactory.buildList(2);
const mockUser = UsersFactory.build();

const mockUsersUsecaseRepo = {
  findAll: jest.fn().mockResolvedValue(mockUsers),
  findOne: jest.fn().mockResolvedValue(mockUser),
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
      mockUsersUsecaseRepo.findAll.mockResolvedValueOnce([]);

      const result = await usecase.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([]);
    });

    it('should return an array of users', async () => {
      const result = await usecase.findAll();

      expect(result).toEqual(mockUsers);
      expect(repo.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await usecase.findOne(1);

      expect(result).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith(1);
    });
  });
});
