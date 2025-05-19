import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Store, StoreRepository } from 'src/core';
import { ContextType } from 'src/common/types';

@Scene('adminStoreScene')
export class AdminStoreScene {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: StoreRepository,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(`Do'kon tugmasi uchun nom kiriting: `);
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const store = await this.storeRepo.findOne({
      where: { id: ctx.session.store_id },
    });
    if (!store) {
      return;
    }
    switch (store.last_state) {
      case 'awaitButtonName': {
        const name = (ctx.update as { message: { text: string } }).message.text;
        store.button_name = name;
        store.last_state = 'awaitButtonUrl';
        await this.storeRepo.save(store);
        await ctx.reply(`Do'kon tugmasi uchun URL manzil kiriting: `);
        return;
      }
      case 'awaitButtonUrl': {
        const url = (ctx.update as { message: { text: string } }).message.text;
        store.button_url = `https://t.me/${url.replace(/^@/, '')}`;
        store.last_state = '';
        await this.storeRepo.save(store);
        await ctx.reply(
          "Do'kon yaratildi endi u foydalanuvchilarga korinishi mumkin ",
        );
        await ctx.scene.leave();
        return;
      }
      default:
        await ctx.reply(
          "Siz hali do'kon tugmasini yaratmadingiz. Iltimos, avval do'kon tugmasini yarating.",
        );
        return;
    }
  }
}
