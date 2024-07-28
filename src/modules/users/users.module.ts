import { Module, Provider } from '@nestjs/common';
import { UsersHttpController } from './controller/users.http.controller';
import { UsersRepo } from './repo/users.repo';
import { UsersUsecase } from './usecase/users.usecase';
import { LogSomethingWhenUserCreatedDomainEventHandler } from './event-handler/log-something-when-user-create.domain-event-handler';

const eventHandlers: ReadonlyArray<Provider> = [
  LogSomethingWhenUserCreatedDomainEventHandler,
];
const usecase: ReadonlyArray<Provider> = [UsersRepo, UsersUsecase];

@Module({
  controllers: [UsersHttpController],
  providers: [...usecase, ...eventHandlers],
  exports: [],
})
export class UsersModule {}
