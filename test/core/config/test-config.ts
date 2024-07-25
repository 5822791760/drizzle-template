import { get } from 'env-var';
import * as path from 'path';
import './dotenv';

class TestConfig {
  public dbConfigUrl: string;
  public migrationFolder: string;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    this.dbConfigUrl = this.getDbConfigUrl();
    this.migrationFolder = this.getMigrationFolder();
  }

  private getDbConfigUrl(): string {
    const host = get('POSTGRES_HOST').required().asString();
    const port = get('POSTGRES_PORT').required().asIntPositive();
    const user = get('POSTGRES_USER').required().asString();
    const password = get('POSTGRES_PASSWORD').required().asString();
    const database = get('POSTGRES_DB').required().asString();

    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  private getMigrationFolder(): string {
    return path.resolve(__dirname, '../../../src/modules/drizzle/migrations');
  }
}

const testConfig = new TestConfig();

export default testConfig;
