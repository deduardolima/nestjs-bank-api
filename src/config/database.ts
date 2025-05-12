import * as path from 'node:path';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    ssl: configService.get('DB_SSL_MODE')
      ? { rejectUnauthorized: false }
      : false,
    entities: [
      path.join(__dirname, '/../modules/**/infra/entities/*.entity{.ts,.js}'),
    ],
    migrations: [path.join(__dirname, '/../migrations/*.{ts,js}')],
    synchronize: false,
    migrationsRun: true,
    logging: false
  }),
};
