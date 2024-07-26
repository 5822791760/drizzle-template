import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { UsersUsecase } from './usecase/users.usecase';
import { match } from 'oxide.ts';
import { UserNotFoundError } from './users.error';

@Controller('users')
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Get()
  async findAll() {
    const res = await this.usersUsecase.findAll();
    return match(res, {
      Ok: (users) => users,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.usersUsecase.findOne(id);
    return match(res, {
      Ok: (users) => users,
      Err: (err) => {
        if (err instanceof UserNotFoundError) {
          throw new BadRequestException(err);
        }

        throw new InternalServerErrorException(err);
      },
    });
  }
}
