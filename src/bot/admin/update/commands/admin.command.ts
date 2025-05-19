import { Command, Update, Ctx } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { Store, StoreRepository } from 'src/core';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { InjectRepository } from '@nestjs/typeorm';

@UseGuards(AdminGuard)
@Update()
export class AdminCommands {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: StoreRepository,
  ) {}
  @Command('admin')
  async start(@Ctx() ctx: ContextType) {
    await ctx.reply(
      "/search - Uy elonlarini qidirish\n/addStore - Do'kon qo'shish\n/storeList - Do'konlar ro'yxati\n",
    );
  }

  @Command('search')
  async search(@Ctx() ctx: ContextType) {
    await ctx.scene.enter('adminHomeScene');
  }

  @Command('addStore')
  async addStore(@Ctx() ctx: ContextType) {
    const newStore = this.storeRepo.create({
      last_state: 'awaitButtonName',
    });
    await this.storeRepo.save(newStore);
    ctx.session.store_id = newStore.id;
    await ctx.scene.enter('adminStoreScene');
  }

  @Command('storeList')
  async storeList(@Ctx() ctx: ContextType) {
    const stores = await this.storeRepo.find();
    if (stores.length === 0) {
      await ctx.reply("Do'konlar ro'yxati bo'sh.");
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
