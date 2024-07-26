import { Module, Provider } from '@nestjs/common';
import { UsersHttpController } from './controller/users.http.controller';
import { UsersService } from './service/users.service';
import { UsersUsecaseRepo } from './usecase/users.usecase.repo';
import { UsersUsecase } from './usecase/users.usecase';
import { UsersServiceRepo } from './service/users.service.repo';

const usecase: ReadonlyArray<Provider> = [UsersUsecaseRepo, UsersUsecase];

const service: ReadonlyArray<Provider> = [UsersServiceRepo, UsersService];

@Module({
  controllers: [UsersHttpController],
  imports: [],
  providers: [...usecase, ...service],
  exports: [UsersService],
})
export class UsersModule {}
