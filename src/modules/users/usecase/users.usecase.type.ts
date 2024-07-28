import {
  UsersUsecaseRepoFindAll,
  UsersUsecaseRepoFindOne,
} from '../repo/users.repo.type';

// Service
// Usecase

export interface UsersUsecaseFindAll extends UsersUsecaseRepoFindAll {}
export interface UsersUsecaseFindOne extends UsersUsecaseRepoFindOne {}
