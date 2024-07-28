import { Injectable } from '@nestjs/common';
import { CITIES, USERS } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { Err, Ok, Result } from 'oxide.ts';
import {
  UsersUsecaseRepoFindOne,
  UsersUsecaseRepoFindAll,
} from './users.repo.type';
import { UserNotFoundError } from '../users.error';
import { DrizzleRepoBase } from '../../drizzle/drizzle.base';

@Injectable()
export class UsersRepo extends DrizzleRepoBase {
  async findAll(): Promise<Result<UsersUsecaseRepoFindAll, null>> {
    const data = await this.db
      .select({
        id: USERS.id,
        name: USERS.name,
      })
      .from(USERS);
    return Ok(data);
  }

  async findOne(
    id: number,
  ): Promise<Result<UsersUsecaseRepoFindOne, UserNotFoundError>> {
    const [user] = await this.db
      .select({
        id: USERS.id,
        name: USERS.name,
        city: {
          id: CITIES.id,
          name: CITIES.name,
        },
      })
      .from(USERS)
      .leftJoin(CITIES, eq(CITIES.id, USERS.cityId))
      .where(eq(USERS.id, id));

    if (!user) {
      return Err(new UserNotFoundError());
    }

    return Ok(user);
  }
}
