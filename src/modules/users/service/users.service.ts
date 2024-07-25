import { Injectable } from '@nestjs/common';
import { UsersServiceRepo } from './users.service.repo';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersServiceRepo) {}
}
