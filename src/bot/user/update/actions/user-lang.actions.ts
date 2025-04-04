import { InjectRepository } from '@nestjs/typeorm';
import { Update, Action, Ctx } from 'nestjs-telegraf';
import { userMainMessage, usersMenu } from 'src/common/constants';
import { UserLang } from 'src/common/enum';
import { ContextType } from 'src/common/types';
import { UserRepository, User } from 'src/core';

@Update()
export class UserLangActions {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}
  @Action('uzbek')
  async uzbek(@Ctx() ctx: ContextType) {
    const newUser = this.userRepo.create({
      telegram_id: ctx.from?.id.toString(),
      lang: UserLang.UZ,
      username: ctx.from?.username || 'unknown',
      first_name: ctx.from?.first_name || 'unknown',
      last_name: ctx.from?.last_name || 'unknown',
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText(userMainMessage.uz, {
      reply_markup: usersMenu.uz,
    });
  }

  @Action('russian')
  async russian(@Ctx() ctx: ContextType) {
    const newUser = this.userRepo.create({
      telegram_id: ctx.from?.id.toString(),
      lang: UserLang.RU,
      username: ctx.from?.username || 'unknown',
      first_name: ctx.from?.first_name || 'unknown',
      last_name: ctx.from?.last_name || 'unknown',
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText(userMainMessage.ru, {
      reply_markup: usersMenu.ru,
    });
  }

  @Action('english')
  async english(@Ctx() ctx: ContextType) {
    const newUser = this.userRepo.create({
      telegram_id: ctx.from?.id.toString(),
      lang: UserLang.EN,
      username: ctx.from?.username || 'unknown',
      first_name: ctx.from?.first_name || 'unknown',
      last_name: ctx.from?.last_name || 'unknown',
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText(userMainMessage.en, {
      reply_markup: usersMenu.en,
    });
  }
}
