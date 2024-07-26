import { Result } from 'oxide.ts';
import { USERS } from '../../drizzle/schema';
import { UserNotFoundError } from '../users.error';

type SelectUser = typeof USERS.$inferSelect;

// Repo
interface RepoFindAll extends Array<SelectUser> {}
interface RepoFindOne extends SelectUser {}

// Service
export interface ServiceFindAll extends Array<SelectUser> {}
export interface ServiceFindOne extends SelectUser {}

export type UsersUsecaseRepoFindAll = Result<RepoFindAll, null>;
export type UsersUsecaseRepoFindOne = Result<RepoFindOne, UserNotFoundError>;
export type UsersUsecaseFindAll = Result<ServiceFindAll, null>;
export type UsersUsecaseFindOne = Result<ServiceFindOne, UserNotFoundError>;
