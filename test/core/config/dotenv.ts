import { config } from 'dotenv';
import * as path from 'path';

// Initializing dotenv
const envPath: string = path.resolve(__dirname, '../../../.env.test');
config({ path: envPath });
