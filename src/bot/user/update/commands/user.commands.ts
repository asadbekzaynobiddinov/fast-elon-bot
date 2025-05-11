import { InjectRepository } from '@nestjs/typeorm';
import { Update, Command, Ctx } from 'nestjs-telegraf';
import { userMainMessage, usersMenu } from 'src/common/constants';
import { ContextType } from 'src/common/types';
import { UserRepository, User, Admin, AdminRepository } from 'src/core';
import { Markup } from 'telegraf';

@Update()
export class UserCommands {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
    @InjectRepository(Admin) private readonly adminRepo: AdminRepository,
  ) {}
  @Command('start')
  async start(@Ctx() ctx: ContextType) {
    const user = await this.userRepo.findOne({
      where: { telegram_id: ctx.from?.id.toString() },
    });
    const messageText = (ctx.update as { message: { text: string } }).message
      .text;
    const isReferal = messageText.includes('/start ref=admin');

    if (isReferal) {
      const adminExist = await this.adminRepo.findOne({
        where: { telegram_id: ctx.from?.id.toString() },
      });
      if (!adminExist) {
        await this.adminRepo.save({
          telegram_id: ctx.from?.id.toString(),
        });
        return '/search - Uy elonlarini qidirish';
      }
    }
    if (!user) {
      ctx.session.lastMessage = await ctx.reply(
        'Kerakli tilni tanlang !\n\nВыберите нужный язык !\n\nSelect the required language !\n\n',
        {
          reply_markup: {
            inline_keyboard: [
              [Markup.button.callback("🇺🇿 O'zbekcha", 'uzbek')],
              [Markup.button.callback('🇷🇺 Русский', 'russian')],
              [Markup.button.callback('🇬🇧 English', 'english')],
            ],
          },
        },
      );
      return;
    }
    ctx.session.lastMessage = await ctx.reply(userMainMessage[user.lang], {
      reply_markup: usersMenu[user.lang],
    });
  }
}
