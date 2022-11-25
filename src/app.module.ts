import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        process.env.DATABASE_URL !== null
          ? {
              dialect: 'postgres',
              uri: process.env.DATABASE_URL,
              autoLoadModels: true,
              synchronize: true,
            }
          : {
              dialect: 'postgres',
              host: configService.get('POSTGRES_HOST'),
              port: +configService.get<number>('POSTGRES_PORT'),
              username: configService.get('POSTGRES_USER'),
              password: configService.get('POSTGRES_PASSWORD'),
              database: configService.get('POSTGRES_DATABASE'),
              autoLoadModels: true,
              synchronize: true,
              repositoryMode: true,
            },
    }),
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
