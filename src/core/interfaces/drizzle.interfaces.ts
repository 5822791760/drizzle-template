import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../modules/drizzle/schema';

export type DrizzleDb = NodePgDatabase<typeof schema>;
