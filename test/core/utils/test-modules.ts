import { Test } from '@nestjs/testing';
import { InjectionToken, Provider, Type } from '@nestjs/common';
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { TestDrizzleService } from './test-drizzle.service';

export async function createRepoTestingModule(repoProvider: Provider) {
  return Test.createTestingModule({
    imports: [],
    providers: [
      repoProvider,
      TestDrizzleService,
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

export async function createServiceTestingModule<T>(
  serviceProvider: Provider,
  token: InjectionToken,
  mockRepo: T,
) {
  return Test.createTestingModule({
    providers: [
      serviceProvider,
      {
        provide: token,
        useValue: mockRepo,
      },
    ],
  }).compile();
}

export async function createControllerTestingModule<T>(
  controller: Type<any>,
  token: InjectionToken,
  mockUsecase: T,
) {
  const module = await Test.createTestingModule({
    controllers: [controller],
    providers: [
      {
        provide: token,
        useValue: mockUsecase,
      },
    ],
  }).compile();

  const nestApp = module.createNestApplication();
  await nestApp.init();

  return { module, nestApp };
}
