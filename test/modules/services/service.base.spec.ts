import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { ServiceBase } from '@services/service.base';
import { createServiceTestingModule } from '@testcore/utils/test-modules';
import { EventEntity } from '@core/ddd/event-entity.base';
import { Err, Ok, Result } from 'oxide.ts';
import { EntityValidationError } from '@core/error/entity-validate.error';
import { Injectable } from '@nestjs/common';
import { TestDrizzleService } from '@testcore/utils/test-drizzle.service';
import { sql } from 'drizzle-orm';

const TESTS = pgTable('tests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
});

class TestsEntity extends EventEntity<{ name: string }> {
  public validate(): Err<Error> | null {
    const props = this.getProps();
    if (props.name.length > 10) {
      return Err(new EntityValidationError());
    }

    return null;
  }

  public toDbValues(): typeof TESTS.$inferInsert {
    const props = this.getProps();
    return {
      name: props.name,
    };
  }
}

@Injectable()
class TestService extends ServiceBase<TestsEntity, typeof TESTS> {
  async getById(id: number): Promise<Result<TestsEntity, Error>> {
    const res = await this.selectById(id);
    if (res.isErr()) {
      return Err(new Error());
    }

    const user = res.unwrap();
    return Ok(
      new TestsEntity({
        id: user.id,
        props: { name: user.name },
      }),
    );
  }

  async testSelectById(id: number) {
    return this.selectById(id);
  }

  get _table() {
    return TESTS;
  }
}

describe('ServiceBase', () => {
  let service: TestService;
  let drizzle: TestDrizzleService;

  beforeAll(async () => {
    const module = await createServiceTestingModule(TestService);

    service = module.get(TestService);
    drizzle = module.get(TestDrizzleService);

    const db = await drizzle.getDrizzle();

    await db.execute(
      sql`CREATE TABLE tests ( id SERIAL PRIMARY KEY, name character varying(256) )`,
    );
  });

  afterAll(async () => {
    await drizzle.execute(sql`DROP TABLE tests`);
    await drizzle.close();
  });

  describe('selectById', () => {
    let id: number;

    beforeAll(async () => {
      const [insertedId] = await drizzle.insert(TESTS, { name: 'test' });
      id = insertedId;
    });

    it('Should return data if exists', async () => {
      const res = await service.testSelectById(id);

      expect(res.isErr()).toEqual(false);

      const data = res.unwrap();
      expect(data).toMatchObject(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      );
      expect(data.name).toBeDefined();
      expect(data.name).toEqual('test');
    });

    it('Should return error if data not found', async () => {
      const res = await service.testSelectById(99999);
      expect(res.isErr()).toEqual(true);
    });
  });

  describe('save', () => {
    beforeEach(async () => {
      await drizzle.cleanTables(TESTS);
    });

    it('Should create Entity if no id', async () => {
      const res = await service.save(
        new TestsEntity({ props: { name: 'test' } }),
      );

      expect(res.isErr()).toEqual(false);

      const data = res.unwrap();
      expect(data).toBeInstanceOf(TestsEntity);
      expect(data.id).toBeTruthy();

      // Check DB
      // I will use previous tested function
      const newRes = await service.testSelectById(data.id);
      expect(newRes.isErr()).toEqual(false);

      const newData = newRes.unwrap();
      expect(newData.name).toEqual('test');
      expect(newData.id).toEqual(data.id);
    });

    it('Should update Entity if have id', async () => {
      const [id] = await drizzle.insert(TESTS, { name: 'test' });
      const res = await service.save(
        new TestsEntity({ id, props: { name: 'updated' } }),
      );

      expect(res.isErr()).toEqual(false);

      const data = res.unwrap();
      expect(data).toBeInstanceOf(TestsEntity);
      expect(data.id).toBeTruthy();
      expect(data.getProps().name).toEqual('updated');

      // Check DB
      // I will use previous tested function
      const newRes = await service.testSelectById(data.id);
      expect(newRes.isErr()).toEqual(false);

      const newData = newRes.unwrap();
      expect(newData.name).toEqual('updated');
      expect(newData.id).toEqual(data.id);
    });

    it('Should return error if failed validation', async () => {
      const res = await service.save(
        // More than 10 char
        new TestsEntity({ props: { name: 'testtesttesttesttesttesttest' } }),
      );

      expect(res.isErr()).toEqual(true);
      expect(res.unwrapErr()).toBeInstanceOf(EntityValidationError);
    });
  });
});
