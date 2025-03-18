/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { config } from 'src/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TelegrafModule.forRoot({
      token: config.TOKEN,
      middlewares: [
        session(),
        async (ctx, next) => {
          if (!ctx.session) {
            ctx.session = {};
          }
          await next();
        },
      ],
    }),
    UserModule,
  ],
})
export class BotModule {}
