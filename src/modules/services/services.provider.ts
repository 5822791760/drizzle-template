import { Logger, Provider } from '@nestjs/common';
import { USERS_SERVICE } from './core/users/users.di-tokens';
import { UsersService } from './core/users/users.service';
import { LOGGERS_SERVICE } from './sub/loggers/loggers.di-tokens';

export const SERVICE_PROVIDER: Array<Provider> = [
  {
    provide: USERS_SERVICE,
    useClass: UsersService,
  },
  {
    provide: LOGGERS_SERVICE,
    useClass: Logger,
  },
];
