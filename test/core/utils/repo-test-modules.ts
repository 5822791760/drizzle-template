import { Test } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
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
