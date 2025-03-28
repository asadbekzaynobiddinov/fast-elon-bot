import { InjectRepository } from '@nestjs/typeorm';
import { Update, Command, Ctx } from 'nestjs-telegraf';
import { userMainMessage, usersMenu } from 'src/common/constants';
import { ContextType } from 'src/common/types/indeex';
import { UserRepository, User } from 'src/core';
import { Markup } from 'telegraf';

@Update()
export class UserCommands {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}
  @Command('start')
  async start(@Ctx() ctx: ContextType) {
    const user = await this.userRepo.findOne({
      where: { telegram_id: ctx.from?.id.toString() },
    });
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
