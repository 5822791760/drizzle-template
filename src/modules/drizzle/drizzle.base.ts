import { Inject, Logger } from '@nestjs/common';
import { DRIZZLE_ORM } from '../../core/constants/db.constants';
import { DrizzleDb } from '../../core/interfaces/drizzle.interfaces';
import { RequestContextService } from '../../core/application/context/request-context';
import { LOGGERS_SERVICE } from '../services/sub/loggers/loggers.di-tokens';

export class DrizzleRepoBase {
  constructor(
    @Inject(DRIZZLE_ORM) private drizzle: DrizzleDb,
    @Inject(LOGGERS_SERVICE) protected logger: Logger,
  ) {}

  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    const db = this.db as DrizzleDb;
    return db.transaction(async (tx) => {
      this.logger.debug(
        `[${RequestContextService.getRequestId()}] transaction started`,
      );
      if (!RequestContextService.getTransactionConnection()) {
        RequestContextService.setTransactionConnection(tx);
      }

      try {
        const result = await handler();
        this.logger.debug(
          `[${RequestContextService.getRequestId()}] transaction committed`,
        );
        return result;
      } catch (e) {
        this.logger.debug(
          `[${RequestContextService.getRequestId()}] transaction aborted`,
        );
        throw e;
      } finally {
        RequestContextService.cleanTransactionConnection();
      }
    });
  }

  get db(): Omit<DrizzleDb, 'transaction'> {
    return (RequestContextService.getContext()?.transactionConnection ??
      this.drizzle) as DrizzleDb;
  }
}
