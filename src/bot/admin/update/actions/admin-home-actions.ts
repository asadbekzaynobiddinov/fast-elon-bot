/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { Home, HomeRepository } from 'src/core';
import { ContextType } from 'src/common/types';
import { config } from 'src/config';
import { HomeType } from 'src/common/enum';

@Update()
export class AdminHomeActions {
  constructor(
    @InjectRepository(Home) private readonly homeRepo: HomeRepository,
  ) {}

  @Action(/confirmHomeAsAdmin/)
  async confirmHomeAsAdmin(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');

    const homeAdd = await this.homeRepo.findOne({
      where: { id },
    });

    if (!homeAdd) {
      return;
    }

    await ctx.telegram.sendMediaGroup(
      config.HOME_MAIN_CHANEL,
      homeAdd.pictures.map((fileId, index) => ({
        type: 'photo',
        media: fileId,
        parse_mode: 'HTML',
        caption:
          index === 0
            ? `🆔 <b>Id:</b> ${homeAdd.id}\n\n` +
              (homeAdd.type == HomeType.REAL_ESTATE
                ? '<b>Uy sotiladi.</b>\n\n'
                : '<b>Uy ijaraga beriladi.</b>\n\n') +
              `📍 <b>Manzili:</b> ${homeAdd.location}\n` +
              `🏢 <b>Qavatlar soni:</b> ${homeAdd.floors_of_building}\n` +
              `🏬 <b>Uy joylashgan qavati:</b> ${homeAdd.floor_number}\n` +
              `🛏️ <b>Xonalar soni:</b> ${homeAdd.rooms}\n` +
              `📐 <b>Uy maydoni:</b> ${homeAdd.square}\n` +
              `💰 <b>Narx:</b> ${homeAdd.price}\n` +
              `📞 <b>Bog'lanish uchun:</b> @Fastelonuz\n` +
              `ℹ️ <b>Qo'shimcha ma'lumotlar:</b> ${homeAdd.additional_information}\n\n` +
              `<a href="https://t.me/${ctx.botInfo.username}">E'lon berish uchun bosing</a>`
            : undefined,
      })),
    );

    await ctx.editMessageText('Yuqoridagi uy eloni asosiy kanalga joylandi ✅');
  }

  @Action(/rejectHomeAsAdmin/)
  async rejectHomeAsAdmin(@Ctx() ctx: ContextType) {
    try {
      const [, id] = (ctx.update as any).callback_query.data.split('=');

      await this.homeRepo.delete(id as string);

      await ctx.editMessageText('Yuqoridagi uy eloni bekor qilindi ❌');
    } catch (error) {
      console.log(error.message);
      await ctx.reply('Bekor ilishda xatolik yuz berdi ❌');
    }
  }
}
