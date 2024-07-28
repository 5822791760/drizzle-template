import { Test } from '@nestjs/testing';
import { Logger, Provider, Type, ValueProvider } from '@nestjs/common';
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { TestDrizzleService } from './test-drizzle.service';
import { LOGGERS_SERVICE } from '../../../src/modules/services/sub/loggers/loggers.di-tokens';

export async function createDrizzleRepoTestingModule(repoProvider: Provider) {
  return Test.createTestingModule({
    imports: [],
    providers: [
      repoProvider,
      TestDrizzleService,
      {
        provide: LOGGERS_SERVICE,
        useClass: Logger,
      },
      {
        provide: DRIZZLE_ORM,
        useFactory: async (drizzleService: TestDrizzleService) => {
          const db = await drizzleService.getDrizzle();

          // Run migrate before each test
          await drizzleService.migrate();

          // Clean db before each test
          await drizzleService.cleanDb();

          return db;
        },
        inject: [TestDrizzleService],
      },
    ],
  }).compile();
}

export async function createMockTestingModule(
  serviceProvider: Provider,
  mockProviders: Array<ValueProvider>,
) {
  return Test.createTestingModule({
    providers: [serviceProvider, ...mockProviders],
  }).compile();
}

export async function createControllerTestingModule(
  controller: Type<any>,
  mockProviders: Array<ValueProvider>,
) {
  const module = await Test.createTestingModule({
    controllers: [controller],
    providers: mockProviders,
  }).compile();

  const nestApp = module.createNestApplication();
  await nestApp.init();

  return { module, nestApp };
}
