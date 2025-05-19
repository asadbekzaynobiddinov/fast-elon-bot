/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { Phone, PhoneRepository } from 'src/core';
import { ContextType } from 'src/common/types';
import { config } from 'src/config';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guard/admin.guard';

@UseGuards(AdminGuard)
@Update()
export class AdminPhoneActions {
  constructor(
    @InjectRepository(Phone) private readonly phoneRepo: PhoneRepository,
  ) {}

  @Action(/confirmPhoneAsAdmin/)
  async confirmPhoneAsAdmin(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');

    const phoneAd = await this.phoneRepo.findOne({
      where: { id },
    });

    if (!phoneAd) {
      return;
    }

    await ctx.telegram.sendMediaGroup(
      config.PHONE_MAIN_CHANEL,
      phoneAd.pictures.map((fileId, index) => ({
        type: 'photo',
        media: fileId,
        parse_mode: 'HTML',
        caption:
          index === 0
            ? `🆔 <b>Id:</b> ${phoneAd.id}\n\n` +
              `<b>Nomi: ${phoneAd.name}</b>\n\n` +
              `📱 <b>Holati:</b> ${phoneAd.condition}\n` +
              `💾 <b>Xotira hajmi:</b> ${phoneAd.memory}\n` +
              `🎨 <b>Rangi:</b> ${phoneAd.color}\n` +
              `📦 <b>Quti va hujjatlari:</b> ${phoneAd.box_and_documents}\n` +
              `🔋 <b>Batareyasi:</b> ${phoneAd.battery_condition}\n` +
              `🌍 <b>Hududi:</b> ${phoneAd.region}\n` +
              `📞 <b>Bog'lanish uchun raqam:</b> ${phoneAd.contact_number}\n` +
              `💵 <b>Narxi:</b> ${phoneAd.price}\n\n` +
              `<a href="https://t.me/${ctx.botInfo.username}">E'lon berish uchun bosing</a>`
            : undefined,
      })),
    );

    await ctx.editMessageText(
      'Yuqoridagi telefon eloni asosiy kanalga joylandi ✅',
    );
  }

  @Action(/rejectPhoneAsAdmin/)
  async rejectPhoneAsAdmin(@Ctx() ctx: ContextType) {
    try {
      const [, id] = (ctx.update as any).callback_query.data.split('=');

      await this.phoneRepo.delete(id as string);

      await ctx.editMessageText('Yuqoridagi telefon eloni bekor qilindi ❌');
    } catch (error) {
      console.log(error.message);
      await ctx.reply('Bekor ilishda xatolik yuz berdi ❌');
    }
  }
}
