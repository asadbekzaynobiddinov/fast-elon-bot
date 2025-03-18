import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { User, UserRepository } from 'src/core';
import { CustomContext } from 'src/common/types';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UserLang } from 'src/common/enum';
import { mainMessage } from 'src/common/constants';
import { userMenu } from 'src/common/constants/keys';

@Update()
export class LanguageActions {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}
  @Action('lang_uz')
  async lang_uz(@Ctx() ctx: CustomContext) {
    const newUser = this.userRepo.create({
      telegram_id: `${ctx.from?.id}`,
      username: ctx.from?.username,
      first_name: ctx.from?.first_name,
      last_name: ctx.from?.last_name,
      lang: UserLang.UZ,
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText(mainMessage.uz, {
      reply_markup: userMenu.uz,
    });
  }

  @Action('lang_ru')
  async lang_ru(@Ctx() ctx: CustomContext) {
    const newUser = this.userRepo.create({
      telegram_id: `${ctx.from?.id}`,
      username: ctx.from?.username,
      first_name: ctx.from?.first_name,
      last_name: ctx.from?.last_name,
      lang: UserLang.RU,
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText(mainMessage.ru, {
      reply_markup: userMenu.ru,
    });
  }

  @Action('lang_en')
  async lang_en(@Ctx() ctx: CustomContext) {
    const newUser = this.userRepo.create({
      telegram_id: `${ctx.from?.id}`,
      username: ctx.from?.username,
      first_name: ctx.from?.first_name,
      last_name: ctx.from?.last_name,
      lang: UserLang.EN,
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText(mainMessage.en, {
      reply_markup: userMenu.en,
    });
  }
}
