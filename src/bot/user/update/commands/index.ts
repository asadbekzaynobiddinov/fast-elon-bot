import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Update, Command, Ctx } from 'nestjs-telegraf';
import { mainMessage } from 'src/common/constants';
import { userMenu } from 'src/common/constants/keys';
import { CustomContext } from 'src/common/types';
import { User, UserRepository } from 'src/core/';
import { Markup } from 'telegraf';

@Update()
export class UserCommands {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}
  @Command('start')
  async start(@Ctx() ctx: CustomContext) {
    const user = await this.userRepo.findOne({
      where: { telegram_id: `${ctx.from?.id}` },
    });
    if (!user) {
      const newUser = this.userRepo.create({
        telegram_id: `${ctx.from?.id}`,
        username: ctx.from?.username || 'unknown',
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
      });
      await this.cache.set(`${ctx.from?.id}`, newUser);
      ctx.session.lastMessage = await ctx.reply(
        'Iltimos, tilni tanlang:\n\n' +
          'Пожалуйста, выберите язык:\n\n' +
          'Please select a language:',
        {
          reply_markup: {
            inline_keyboard: [
              [Markup.button.callback('🇺🇿 O‘zbekcha', 'lang_uz')],
              [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
              [Markup.button.callback('🇬🇧 English', 'lang_en')],
            ],
          },
        },
      );
      return;
    }
    if (!user.lang) {
      await ctx.reply('tilni tanash kerak');
      return;
    }
    ctx.session.lang = user.lang;
    ctx.session.lastMessage = await ctx.reply(mainMessage[user.lang], {
      reply_markup: userMenu[user.lang],
    });
  }
}
