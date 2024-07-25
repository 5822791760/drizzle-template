import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { DrizzleDb } from '../../../core/interfaces/drizzle.interfaces';
import { USERS } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersUsecaseRepo {
  constructor(@Inject(DRIZZLE_ORM) private db: DrizzleDb) {}

  async findAll() {
    return this.db.select().from(USERS);
  }

  async findOne(id: number) {
    const [user] = await this.db.select().from(USERS).where(eq(USERS.id, id));
    return user;
  }
}
