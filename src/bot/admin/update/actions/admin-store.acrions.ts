/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Action, Update, Ctx } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Store, StoreRepository } from 'src/core';
import { ContextType } from 'src/common/types';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guard/admin.guard';

@UseGuards(AdminGuard)
@Update()
export class AdminStoreActions {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: StoreRepository,
  ) {}

  @Action(/storeId/)
  async onStoreAction(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');
    const store = await this.storeRepo.findOne({
      where: { id },
    });
    if (!store) {
      return;
    }
    await ctx.editMessageText(
      `🛒 Do'kon haqida ma'lumot:\n\n` +
        `🆔 <b>ID:</b> ${store.id}\n` +
        `🏪 <b>Nomi:</b> ${store.button_name}\n` +
        `🔗 <b>URL:</b> ${store.button_url}\n`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🗑️ O'chirish",
                callback_data: `deleteStore=${store.id}`,
              },
            ],
            [
              {
                text: '⬅️ Orqaga',
                callback_data: 'backToStoreList',
              },
            ],
          ],
        },
      },
    );
  }

  @Action(/deleteStore/)
  async deleteStore(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');
    await this.storeRepo.delete(id as string);
    const stores = await this.storeRepo.find();
    if (stores.length === 0) {
      await ctx.editMessageText("Do'konlar ro'yxati bo'sh.");
      return;
    }

    const buttons: { text: string; callback_data: string }[][] = [];
    for (let i = 0; i < stores.length; i += 2) {
      const row: { text: string; callback_data: string }[] = [];
      row.push({
        text: `${stores[i].button_name}`,
        callback_data: `storeId=${stores[i].id}`,
      });
      if (stores[i + 1]) {
        row.push({
          text: `${stores[i + 1].button_name}`,
          callback_data: `storeId=${stores[i + 1].id}`,
        });
      }
      buttons.push(row);
    }
    await ctx.reply("Do'konlar ro'yxati:", {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  @Action(/backToStoreList/)
  async backToStoreList(@Ctx() ctx: ContextType) {
    const stores = await this.storeRepo.find();
    if (stores.length === 0) {
      await ctx.editMessageText("Do'konlar ro'yxati bo'sh.");
      return;
    }

    const buttons: { text: string; callback_data: string }[][] = [];
    for (let i = 0; i < stores.length; i += 2) {
      const row: { text: string; callback_data: string }[] = [];
      row.push({
        text: `${stores[i].button_name}`,
        callback_data: `storeId=${stores[i].id}`,
      });
      if (stores[i + 1]) {
        row.push({
          text: `${stores[i + 1].button_name}`,
          callback_data: `storeId=${stores[i + 1].id}`,
        });
      }
      buttons.push(row);
    }
    await ctx.reply("Do'konlar ro'yxati:", {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }
}
