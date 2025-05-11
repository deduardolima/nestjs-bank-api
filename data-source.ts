import 'dotenv/config';

import * as path from 'path';

import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const configService = new ConfigService();

export const databaseSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get('DB_PORT')),
  username: configService.get<string>('DB_USERNAME'),
  password: String(configService.get<string>('DB_PASSWORD')),
  database: configService.get<string>('DB_NAME'),
  ssl:
    configService.get<string>('DB_SSL_MODE') === 'true'
      ? { rejectUnauthorized: false }
      : false,
  entities: [path.join(__dirname, '/src/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/src/migrations/*.{ts,js}')],
  synchronize: false,
  migrationsRun: true,
  logging: false,
});
