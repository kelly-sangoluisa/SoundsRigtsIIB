import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (serviceName: string): TypeOrmModuleOptions => {
  const baseConfig = {
    type: 'postgres' as const,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
    retryAttempts: 3,
    retryDelay: 3000,
  };

  switch (serviceName) {
    case 'auth':
      return {
        ...baseConfig,
        name: 'authConnection',
        host: process.env.AUTH_DB_HOST || 'localhost',
        port: parseInt(process.env.AUTH_DB_PORT, 10) || 5432,
        username: process.env.AUTH_DB_USERNAME || 'postgres',
        password: process.env.AUTH_DB_PASSWORD || 'password',
        database: process.env.AUTH_DB_DATABASE || 'auth_db',
        entities: ['dist/users/*.entity{.ts,.js}'],
      };

    case 'songs':
      return {
        ...baseConfig,
        name: 'songsConnection',
        host: process.env.SONGS_DB_HOST || 'localhost',
        port: parseInt(process.env.SONGS_DB_PORT, 10) || 5433,
        username: process.env.SONGS_DB_USERNAME || 'postgres',
        password: process.env.SONGS_DB_PASSWORD || 'password',
        database: process.env.SONGS_DB_DATABASE || 'songs_db',
        entities: ['dist/songs/*.entity{.ts,.js}'],
      };

    case 'licenses':
      return {
        ...baseConfig,
        name: 'licensesConnection',
        host: process.env.LICENSES_DB_HOST || 'localhost',
        port: parseInt(process.env.LICENSES_DB_PORT, 10) || 5434,
        username: process.env.LICENSES_DB_USERNAME || 'postgres',
        password: process.env.LICENSES_DB_PASSWORD || 'password',
        database: process.env.LICENSES_DB_DATABASE || 'licenses_db',
        entities: ['dist/licenses/*.entity{.ts,.js}'],
      };

    case 'chat':
      return {
        ...baseConfig,
        name: 'chatConnection',
        host: process.env.CHAT_DB_HOST || 'localhost',
        port: parseInt(process.env.CHAT_DB_PORT, 10) || 5435,
        username: process.env.CHAT_DB_USERNAME || 'postgres',
        password: process.env.CHAT_DB_PASSWORD || 'password',
        database: process.env.CHAT_DB_DATABASE || 'chat_db',
        entities: ['dist/chat/*.entity{.ts,.js}'],
      };

    default:
      throw new Error(`Unknown service: ${serviceName}`);
  }
};
