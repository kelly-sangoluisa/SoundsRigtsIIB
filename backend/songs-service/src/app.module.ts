import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsModule } from './songs/songs.module';
import { LicensesModule } from './licenses/licenses.module';
import { Song } from './songs/entities/song.entity';
import { License } from './licenses/entities/license.entity';
import { User } from './shared/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'admin',
      password: process.env.DATABASE_PASSWORD || 'admin123',
      database: process.env.DATABASE_NAME || 'soundsrights',
      entities: [User, Song, License],
      synchronize: false,
    }),
    SongsModule,
    LicensesModule,
  ],
})
export class AppModule {}
