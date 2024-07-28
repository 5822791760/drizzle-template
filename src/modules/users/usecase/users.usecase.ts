import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../repo/users.repo';
import { UsersUsecaseFindAll, UsersUsecaseFindOne } from './users.usecase.type';
import { Result } from 'oxide.ts';
import { UserNotFoundError } from '../users.error';

@Injectable()
export class UsersUsecase {
  constructor(private readonly repo: UsersRepo) {}

  async findAll(): Promise<Result<UsersUsecaseFindAll, null>> {
    return this.repo.findAll();
  }

  async findOne(
    id: number,
  ): Promise<Result<UsersUsecaseFindOne, UserNotFoundError>> {
    return this.repo.findOne(id);
  }
}
