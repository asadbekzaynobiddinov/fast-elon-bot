import { Action, Update, Ctx } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { UseGuards } from '@nestjs/common';
import { LangGuard } from 'src/common/guard/lang.guard';
import { LastMessageGuard } from 'src/common/guard/last-message.guard';
import { Store, StoreRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm/dist';
import {
  backFromPhomeMenu,
  shopMessage,
  userMainMessage,
  usersMenu,
} from 'src/common/constants';
import { Not, IsNull } from 'typeorm';

@UseGuards(LangGuard)
@UseGuards(LastMessageGuard)
@Update()
export class UserShopActions {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: StoreRepository,
  ) {}
  @Action('shops')
  async shops(@Ctx() ctx: ContextType) {
    const stores = await this.storeRepo.find({
      where: {
        button_name: Not(IsNull()),
        button_url: Not(IsNull()),
      },
    });
    if (stores.length === 0) {
      await ctx.answerCbQuery("Do'konlar ro'yxati bo'sh.", {
        show_alert: true,
      });
      return;
    }

    const buttons: { text: string; url: string }[][] = [];
    for (let i = 0; i < stores.length; i += 2) {
      const row: { text: string; url: string }[] = [];
      row.push({
        text: `${stores[i].button_name}`,
        url: stores[i].button_url,
      });
      if (stores[i + 1]) {
        row.push({
          text: `${stores[i + 1].button_name}`,
          url: stores[i + 1].button_url,
        });
      }
      buttons.push(row);
    }
    await ctx.editMessageText(shopMessage[ctx.session.lang] as string, {
      reply_markup: {
        inline_keyboard: [
          ...buttons,
          [
            {
              text: backFromPhomeMenu[ctx.session.lang] as string,
              callback_data: 'backToMainMenu',
            },
          ],
        ],
      },
    });
  }

  @Action('backToMainMenu')
  async backToMainMenu(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: usersMenu[ctx.session.lang],
    });
  }
}
