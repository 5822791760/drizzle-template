import { Controller, Get } from '@nestjs/common';
import { UsersUsecase } from './usecase/users.usecase';

@Controller('users')
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Get()
  async findAll() {
    return this.usersUsecase.findAll();
  }
}
