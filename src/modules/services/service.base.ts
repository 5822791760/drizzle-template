import { Inject, Logger } from '@nestjs/common';
import { DRIZZLE_ORM } from '../../core/constants/db.constants';
import { DrizzleDb } from '../../core/interfaces/drizzle.interfaces';
import { DrizzleRepoBase } from '../drizzle/drizzle.base';
import { LOGGERS_SERVICE } from './sub/loggers/loggers.di-tokens';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PgTable } from 'drizzle-orm/pg-core';
import { EventEntity } from '../../core/ddd/event-entity.base';
import { eq } from 'drizzle-orm';
import { Err, Ok, Result } from 'oxide.ts';

export abstract class ServiceBase<
  E extends EventEntity<any>,
  T extends PgTable,
> extends DrizzleRepoBase {
  constructor(
    @Inject(DRIZZLE_ORM) drizzle: DrizzleDb,
    @Inject(LOGGERS_SERVICE) logger: Logger,
    protected evenEmitter: EventEmitter2,
  ) {
    super(drizzle, logger);
  }

  abstract getById(id: number): Promise<Result<E, Error>>;
  abstract get _table(): T;

  async save(entity: E): Promise<Result<E, Error>> {
    const table = this._table;

    const err = entity.validate();
    if (err) {
      return err;
    }

    try {
      if (entity.id) {
        await this.db
          .update(table)
          .set(entity.toDbValues())
          .where(eq(table['id'], entity.id));
      } else {
        await this.db.insert(table).values(entity.toDbValues());
      }

      await entity.publishEvents(this.logger, this.evenEmitter);
    } catch (e) {
      return Err(e);
    }

    return Ok(entity);
  }

  protected async selectById(
    id: number,
  ): Promise<Result<T['$inferSelect'], Error>> {
    const table = this._table;

    const [data] = await this.db
      .select()
      .from(table)
      .where(eq(table['id'], id));

    if (!data) {
      return Err(new Error('data not found'));
    }

    return Ok(data);
  }
}
