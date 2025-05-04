/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  TelegrafModuleOptions,
  TelegrafModuleAsyncOptions,
} from 'nestjs-telegraf';
import { session } from 'telegraf';
import { config } from './index';

const telegrafModuleOptions = (): TelegrafModuleOptions => {
  return {
    token: config.TOKEN,
    middlewares: [
      session(),
      async (ctx, next) => {
        if (!ctx.session) {
          ctx.session = {};
          ctx.session.car_photos = [];
          ctx.session.phone_photos = [];
          ctx.session.home_photos = [];
        }
        await next();
      },
    ],
  };
};

export const options = (): TelegrafModuleAsyncOptions => {
  return {
    useFactory: () => telegrafModuleOptions(),
  };
};
