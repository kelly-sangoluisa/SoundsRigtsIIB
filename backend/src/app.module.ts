import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { LicensesModule } from './licenses/licenses.module';
import { ChatModule } from './chat/chat.module';
import { GatewayModule } from './gateway/gateway.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ...(process.env.SKIP_DB !== 'true' ? [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.AUTH_DB_HOST || 'localhost',
        port: parseInt(process.env.AUTH_DB_PORT, 10) || 5437,
        username: process.env.AUTH_DB_USERNAME || 'postgres',
        password: process.env.AUTH_DB_PASSWORD || 'password',
        database: process.env.AUTH_DB_DATABASE || 'auth_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        autoLoadEntities: true,
        retryAttempts: 3,
        retryDelay: 3000,
      }),
    ] : []),
    AuthModule,
    UsersModule,
    SongsModule,
    LicensesModule,
    ChatModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}