import { Injectable } from '@nestjs/common';
import { UsersUsecaseRepo } from './users.usecase.repo';

@Injectable()
export class UsersUsecase {
  constructor(private readonly repo: UsersUsecaseRepo) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    return this.repo.findOne(id);
  }
}
