/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { config } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRepository } from 'src/core';

@Injectable()
export class LangGuard implements CanActivate {
  private readonly bot: Telegraf;

  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {
    this.bot = new Telegraf(config.TOKEN);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [ctx] = context.getArgs();
    try {
      const user = await this.userRepo.findOne({
        where: { telegram_id: `${ctx.from.id}` },
      });
      if (user) {
        ctx.session.lang = user.lang;
      } else {
        ctx.session.lang = 'uz';
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}
