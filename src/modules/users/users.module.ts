import { Module, Provider } from '@nestjs/common';
import { UsersHttpController } from './controller/users.http.controller';
import { UsersRepo } from './repo/users.repo';
import { UsersUsecase } from './usecase/users.usecase';

const usecase: ReadonlyArray<Provider> = [UsersRepo, UsersUsecase];

@Module({
  controllers: [UsersHttpController],
  providers: [...usecase],
  exports: [],
})
export class UsersModule {}
