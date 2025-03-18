/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { CustomContext } from 'src/common/types';
import {
  mainMessage,
  selectLang,
  settingsMenu,
  userMenu,
} from 'src/common/constants';
import { Markup } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRepository } from 'src/core';
import { UserLang } from 'src/common/enum';

@Update()
export class SettingsActions {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}
  @Action('settings')
  async settings(@Ctx() ctx: CustomContext) {
    await ctx.editMessageText(mainMessage[ctx.session.lang], {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('change_lang')
  async changeLang(@Ctx() ctx: CustomContext) {
    await ctx.editMessageText(selectLang[ctx.session.lang], {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('🇺🇿 O‘zbekcha', 'uz')],
          [Markup.button.callback('🇷🇺 Русский', 'ru')],
          [Markup.button.callback('🇬🇧 English', 'en')],
        ],
      },
    });
  }

  @Action('uz')
  async setLangUz(@Ctx() ctx: CustomContext) {
    ctx.session.lang = 'uz';
    await this.userRepo.update(
      { telegram_id: `${ctx.from?.id}` },
      { lang: UserLang.UZ },
    );
    await ctx.editMessageText(mainMessage[ctx.session.lang], {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('ru')
  async setLangRu(@Ctx() ctx: CustomContext) {
    ctx.session.lang = 'ru';
    await this.userRepo.update(
      { telegram_id: `${ctx.from?.id}` },
      { lang: UserLang.RU },
    );
    await ctx.editMessageText(mainMessage[ctx.session.lang], {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('en')
  async setLangEn(@Ctx() ctx: CustomContext) {
    ctx.session.lang = 'en';
    await this.userRepo.update(
      { telegram_id: `${ctx.from?.id}` },
      { lang: UserLang.EN },
    );
    await ctx.editMessageText(mainMessage[ctx.session.lang], {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('backToMenu')
  async backToMenu(@Ctx() ctx: CustomContext) {
    await ctx.editMessageText(mainMessage[ctx.session.lang], {
      reply_markup: userMenu[ctx.session.lang],
    });
  }
}
