import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { UsersUsecase } from '../usecase/users.usecase';
import { match } from 'oxide.ts';
import { UserNotFoundError } from '../users.error';
import { FindAllUserHttpResponse } from '../dto/http/response/findAll-user.http.response';
import { FindOneUserHttpResponse } from '../dto/http/response/findOne-user.http.response';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersHttpController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Get()
  async findAll(): Promise<Array<FindAllUserHttpResponse>> {
    const res = await this.usersUsecase.findAll();
    return match(res, {
      Ok: (users) => users,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindOneUserHttpResponse> {
    const res = await this.usersUsecase.findOne(+id);
    return match(res, {
      Ok: (users) => users,
      Err: (err) => {
        if (err instanceof UserNotFoundError) {
          throw new BadRequestException(err.message);
        }

        return null;
      },
    });
  }
}
