/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { config } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin, AdminRepository } from 'src/core';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly bot: Telegraf;

  constructor(
    @InjectRepository(Admin) private readonly userRepo: AdminRepository,
  ) {
    this.bot = new Telegraf(config.TOKEN);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [ctx] = context.getArgs();
    try {
      const admin = await this.userRepo.findOne({
        where: { telegram_id: `${ctx.from.id}` },
      });
      if (!admin) {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}
