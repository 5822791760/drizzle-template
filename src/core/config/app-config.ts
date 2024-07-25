import { get } from 'env-var';
import { ClientConfig } from 'pg';
import './dotenv';
import * as path from 'path';

class AppConfig {
  public dbConfig: ClientConfig;
  public dbConfigUrl: string;
  public migrationFolder: string;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    this.dbConfig = this.getDbConfig();
    this.dbConfigUrl = this.getDbConfigUrl();
    this.migrationFolder = this.getMigrationFolder();
  }

  private getDbConfig(): ClientConfig {
    return {
      host: get('POSTGRES_HOST').required().asString(),
      port: get('POSTGRES_PORT').required().asIntPositive(),
      user: get('POSTGRES_USER').required().asString(),
      password: get('POSTGRES_PASSWORD').required().asString(),
      database: get('POSTGRES_DB').required().asString(),
    };
  }

  private getDbConfigUrl(): string {
    return `postgresql://${this.dbConfig.user}:${this.dbConfig.password}@${this.dbConfig.host}:${this.dbConfig.port}/${this.dbConfig.database}`;
  }

  private getMigrationFolder(): string {
    return path.resolve(__dirname, '../../modules/drizzle/migrations');
  }
}

const appConfig = new AppConfig();

export default appConfig;
