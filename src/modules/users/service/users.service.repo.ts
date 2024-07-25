import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { DrizzleDb } from '../../../core/interfaces/drizzle.interfaces';

@Injectable()
export class UsersServiceRepo {
  constructor(@Inject(DRIZZLE_ORM) private db: DrizzleDb) {}
}
