import { Injectable } from '@nestjs/common';
import { ServiceBase } from '../../service.base';
import { UserEntity } from './domain/users.entity';
import { USERS } from '../../../drizzle/schema';
import { Err, Ok, Result } from 'oxide.ts';
import { UserNotFoundError } from '../../../users/users.error';

@Injectable()
export class UsersService extends ServiceBase<UserEntity, typeof USERS> {
  async getById(id: number): Promise<Result<UserEntity, UserNotFoundError>> {
    const res = await this.selectById(id);
    if (res.isErr()) {
      return Err(new UserNotFoundError());
    }

    const user = res.unwrap();
    return Ok(
      new UserEntity({
        id: user.id,
        props: { name: user.name, cityId: user.cityId },
      }),
    );
  }

  get _table() {
    return USERS;
  }
}
