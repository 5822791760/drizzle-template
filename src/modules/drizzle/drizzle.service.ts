import { Inject, Injectable, Logger } from '@nestjs/common';
import { NEST_DRIZZLE_OPTIONS } from 'src/core/constants/db.constants';
import { NestDrizzleOptions } from './interfaces/drizzle.interfaces';
import * as schema from './schema';
import { Pool, PoolClient } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import appConfig from '../../core/config/app-config';

interface IDrizzleService {
  getDrizzle(): Promise<NodePgDatabase<typeof schema>>;
}

@Injectable()
export class DrizzleService implements IDrizzleService {
  private _drizzle: NodePgDatabase<typeof schema>;
  private client: PoolClient;
  private pool: Pool;

  constructor(
    @Inject(NEST_DRIZZLE_OPTIONS)
    private _NestDrizzleOptions: NestDrizzleOptions,
  ) {
    this.pool = new Pool({
      connectionString: this._NestDrizzleOptions.url,
    });
  }

  private logger = new Logger('DrizzleService');

  async getDrizzle() {
    if (!this._drizzle) {
      const client = await this.getClient();
      this._drizzle = drizzle(client, { logger: true, schema });
    }

    return this._drizzle;
  }

  async migrate() {
    const client = await this.getClient();
    const db = drizzle(client, { schema });
    return migrate(db, { migrationsFolder: appConfig.migrationFolder });
  }

  private async getClient() {
    if (!this.client) {
      try {
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
