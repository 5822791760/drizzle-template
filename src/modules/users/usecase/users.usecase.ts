import { Injectable } from '@nestjs/common';
import { UsersUsecaseRepo } from './users.usecase.repo';
import { UsersUsecaseFindAll, UsersUsecaseFindOne } from './users.usecase.type';

@Injectable()
export class UsersUsecase {
  constructor(private readonly repo: UsersUsecaseRepo) {}

  async findAll(): Promise<UsersUsecaseFindAll> {
    return this.repo.findAll();
  }

  async findOne(id: number): Promise<UsersUsecaseFindOne> {
    return this.repo.findOne(id);
  }
}
