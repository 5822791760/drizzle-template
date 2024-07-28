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
