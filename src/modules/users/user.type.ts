// Repo
export interface UsersUsecaseRepoFindAll
  extends Array<{
    id: number;
    name: string;
  }> {}
export interface UsersUsecaseRepoFindOne {
  id: number;
  name: string;
  city: {
    id: number;
    name: string;
  };
}
// Service

// Usecase
export interface UsersUsecaseFindAll extends UsersUsecaseRepoFindAll {}
export interface UsersUsecaseFindOne extends UsersUsecaseRepoFindOne {}
