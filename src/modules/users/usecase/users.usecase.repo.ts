import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { DrizzleDb } from '../../../core/interfaces/drizzle.interfaces';
import { USERS } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { Err, Ok } from 'oxide.ts';
import {
  UsersUsecaseRepoFindAll,
  UsersUsecaseRepoFindOne,
} from './users.usecase.type';
import { UserNotFoundError } from '../users.error';

@Injectable()
export class UsersUsecaseRepo {
  constructor(@Inject(DRIZZLE_ORM) private db: DrizzleDb) {}

  async findAll(): Promise<UsersUsecaseRepoFindAll> {
    const data = await this.db.select().from(USERS);
    return Ok(data);
  }

  async findOne(id: number): Promise<UsersUsecaseRepoFindOne> {
    const [user] = await this.db.select().from(USERS).where(eq(USERS.id, id));

    if (!user) {
      return Err(new UserNotFoundError());
    }

    return Ok(user);
  }
}
