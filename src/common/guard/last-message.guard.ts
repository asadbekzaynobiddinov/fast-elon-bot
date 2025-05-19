/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { config } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRepository } from 'src/core';
import { lastMessageText } from '../constants';

@Injectable()
export class LastMessageGuard implements CanActivate {
  private readonly bot: Telegraf;

  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {
    this.bot = new Telegraf(config.TOKEN);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [ctx] = context.getArgs();
    if (
      ctx.session.lastMessage &&
      ctx.update.callback_query.message.message_id !=
        ctx.session.lastMessage.message_id
    ) {
      await ctx.answerCbQuery(
        lastMessageText[ctx.session.lang] as string,
        ctx.callbackQuery.id,
      );
      await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
      return false;
    }
    return true;
  }
}
