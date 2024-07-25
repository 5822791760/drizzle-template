import { defineConfig } from 'drizzle-kit';
import appConfig from './src/core/config/app-config';

export default defineConfig({
  schema: './src/modules/drizzle/schema.ts',
  dialect: 'postgresql',
  out: './src/modules/drizzle/migrations',
  dbCredentials: {
    url: appConfig.dbConfigUrl,
  },
  verbose: true,
  strict: true,
});
