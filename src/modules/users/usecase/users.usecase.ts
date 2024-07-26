import { Injectable } from '@nestjs/common';
import { UsersUsecaseRepo } from './users.usecase.repo';
import { UsersUsecaseFindAll, UsersUsecaseFindOne } from '../user.type';
import { Result } from 'oxide.ts';
import { UserNotFoundError } from '../users.error';

@Injectable()
export class UsersUsecase {
  constructor(private readonly repo: UsersUsecaseRepo) {}

  async findAll(): Promise<Result<UsersUsecaseFindAll, null>> {
    return this.repo.findAll();
  }

  async findOne(
    id: number,
  ): Promise<Result<UsersUsecaseFindOne, UserNotFoundError>> {
    return this.repo.findOne(id);
  }
}
