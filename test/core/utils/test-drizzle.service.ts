import { Injectable, Logger } from '@nestjs/common';
import * as schema from '@drizzle/schema';
import { Pool, PoolClient } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import testConfig from '../config/test-config';
import { sql } from 'drizzle-orm';
import { PgInsertValue, PgTable } from 'drizzle-orm/pg-core';

@Injectable()
export class TestDrizzleService {
  private _drizzle: NodePgDatabase<typeof schema>;
  private client: PoolClient;
  private pool: Pool;

  constructor() {}

  private logger = new Logger('TestDrizzleService');

  async getDrizzle() {
    if (!this._drizzle) {
      const client = await this.getClient();
      this._drizzle = drizzle(client, { schema });
    }

    return this._drizzle;
  }

  async end() {
    if (this.client) {
      this.client.release();
    }

    if (this.pool) {
      await this.pool.end();
    }
  }

  async migrate() {
    return migrate(this._drizzle, {
      migrationsFolder: testConfig.migrationFolder,
    });
  }

  async insert<T extends PgTable>(
    table: T,
    values: PgInsertValue<T> | Array<PgInsertValue<T>>,
  ): Promise<Array<number>> {
    const db = await this.getDrizzle();
    const res = await db
      .insert(table)
      .values(values as PgInsertValue<T>)
      .returning({ id: table['id'] });

    return res.map((r) => r.id);
  }

  async cleanDb() {
    const db = await this.getDrizzle();

    await Promise.all(
      Object.keys(db._.tableNamesMap).map(async (table) => {
        if (table) {
          await db.execute(sql`TRUNCATE TABLE ${sql.raw(table)} CASCADE;`);
        }
      }),
    );
  }

  private async getClient() {
    if (!this.client) {
      try {
        this.pool = new Pool({
          connectionString: testConfig.dbConfigUrl,
          max: 1,
        });
        this.client = await this.pool.connect();
        this.logger.log('Database connected successfully');
      } catch (error) {
        this.logger.error('Database connection error', error);
        throw error; // Propagate the error
      }
    }

    return this.client;
  }
}
