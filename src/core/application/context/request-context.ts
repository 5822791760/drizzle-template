import { PgTransaction } from 'drizzle-orm/pg-core';
import { RequestContext } from 'nestjs-request-context';
import * as schema from '@drizzle/schema';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { ExtractTablesWithRelations } from 'drizzle-orm';

type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export class AppRequestContext extends RequestContext {
  requestId: string;
  transactionConnection?: Transaction;
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext?.req;
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return this.getContext()?.requestId;
  }

  static getTransactionConnection(): Transaction | undefined {
    const ctx = this.getContext();
    return ctx.transactionConnection;
  }

  static setTransactionConnection(transactionConnection?: Transaction): void {
    const ctx = this.getContext();
    ctx.transactionConnection = transactionConnection;
  }

  static cleanTransactionConnection(): void {
    const ctx = this.getContext();
    ctx.transactionConnection = undefined;
  }
}
