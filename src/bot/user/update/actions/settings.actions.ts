import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { User, UserRepository } from 'src/core';
import {
  changeLangMenu,
  contactUsMenu,
  settingsMenu,
  userMainMessage,
  usersMenu,
} from 'src/common/constants';
import { LangGuard } from 'src/common/guard/lang-guard';
import { ContextType } from 'src/common/types';
import { UserLang } from 'src/common/enum';

@UseGuards(LangGuard)
@Update()
export class UserSettingsActions {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}
  @Action('settings')
  async settings(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('changeLang')
  async changeLang(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: changeLangMenu[ctx.session.lang],
    });
  }

  @Action('setUz')
  async setUz(@Ctx() ctx: ContextType) {
    ctx.session.lang = 'uz';
    if (ctx.from?.id) {
      await this.userRepo.update(
        { telegram_id: ctx.from.id.toString() },
        {
          lang: UserLang.UZ,
        },
      );
    } else {
      throw new Error('User context is missing "from" or "id".');
    }
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('setRu')
  async setRu(@Ctx() ctx: ContextType) {
    ctx.session.lang = 'ru';
    if (ctx.from?.id) {
      await this.userRepo.update(
        { telegram_id: ctx.from.id.toString() },
        {
          lang: UserLang.RU,
        },
      );
    } else {
      throw new Error('User context is missing "from" or "id".');
    }
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('setEn')
  async setEn(@Ctx() ctx: ContextType) {
    ctx.session.lang = 'en';
    if (ctx.from?.id) {
      await this.userRepo.update(
        { telegram_id: ctx.from.id.toString() },
        {
          lang: UserLang.EN,
        },
      );
    } else {
      throw new Error('User context is missing "from" or "id".');
    }
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }
  @Action('constactUs')
  async constactUs(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: contactUsMenu[ctx.session.lang],
    });
  }

  @Action('backFromSettingsMenu')
  async backFromSettingsMenu(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: usersMenu[ctx.session.lang],
    });
  }

  @Action('backFromContactUs')
  async backFromContactUs(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }

  @Action('backFromChangeLang')
  async backFromChangeLang(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: settingsMenu[ctx.session.lang],
    });
  }
}
