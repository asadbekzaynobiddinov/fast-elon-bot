import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextType } from 'src/common/types';
import { Home, HomeRepository } from 'src/core';
import { HomeType } from 'src/common/enum';

@Scene('adminHomeScene')
export class AdminHomeScene {
  constructor(
    @InjectRepository(Home) private readonly homeRepo: HomeRepository,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply('Qidirish uchun id kiriting');
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const id = (ctx.update as { message: { text: string } }).message.text;
    let homeAdd;
    try {
      homeAdd = await this.homeRepo.findOne({
      where: { id },
    });
    } catch (error) {
      await ctx.reply('Xatolik');
      await ctx.scene.leave();
    }
    if (!homeAdd) {
      await ctx.reply('Bunday uy topilmadi');
      return;
    }
    const message =
      `🆔 <b>Id:</b> ${homeAdd.id}\n\n` +
      (homeAdd.type == HomeType.REAL_ESTATE
        ? '<b>Uy sotiladi.</b>\n\n'
        : '<b>Uy ijaraga beriladi.</b>\n\n') +
      `📍 <b>Manzili:</b> ${homeAdd.location}\n` +
      `🏢 <b>Qavatlar soni:</b> ${homeAdd.floors_of_building}\n` +
      `🏬 <b>Uy joylashgan qavati:</b> ${homeAdd.floor_number}\n` +
      `🛏️ <b>Xonalar soni:</b> ${homeAdd.rooms}\n` +
      `📐 <b>Uy maydoni:</b> ${homeAdd.square}\n` +
      `💰 <b>Narx:</b> ${homeAdd.price}\n` +
      `📞 <b>Bog'lanish uchun:</b> ${homeAdd.number_for_contact}\n` +
      `ℹ️ <b>Qo'shimcha ma'lumotlar:</b> ${homeAdd.additional_information}\n\n` +
      `${homeAdd.is_available ? 'Hozirda mavjud ✅' : 'Ijaraga berilgan ❌'}`;
    await ctx.sendPhoto(homeAdd.pictures[0], {
      caption: message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            Markup.button.callback(
              'Mijozga topshirish',
              `giveToClient=${homeAdd.id}`,
            ),
          ],
        ],
      },
    });
    await ctx.scene.leave();
  }
}
