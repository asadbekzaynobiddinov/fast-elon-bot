/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { config } from 'src/config';
import { Car, CarRepository } from 'src/core';

@Update()
export class AdminCarActions {
  constructor(@InjectRepository(Car) private readonly carRepo: CarRepository) {}
  @Action(/acceptCarAd/)
  async acceptCarAd(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');

    const carAd = await this.carRepo.findOne({ where: { id } });

    if (!carAd) {
      return;
    }

    await ctx.telegram.sendMediaGroup(
      config.CAR_MAIN_CHANEL,
      carAd.pictures.map((pic, index) => ({
        type: 'photo',
        media: pic,
        caption:
          index === 0
            ? `<b>🚗 ${carAd.name}</b>\n\n` +
              `<b>📍 Probeg:</b> ${carAd.mileage} km\n` +
              `<b>📅 Yili:</b> ${carAd.year}\n` +
              `<b>⚙️ Holati:</b> ${carAd.condition}\n` +
              `<b>🛡️ Kraska:</b> ${carAd.body_condition}\n` +
              `<b>🎨 Rangi:</b> ${carAd.color}\n` +
              `<b>📌 Hudud:</b> ${carAd.region}\n` +
              `<b>💰 Narxi:</b> ${carAd.price}\n` +
              `<b>📝 Qo'shimcha ma'lumot:</b> ${carAd.additonal_info}\n` +
              `<b>📞 Kontakt:</b> ${carAd.contact_number}`
            : undefined,
        parse_mode: index === 0 ? 'HTML' : undefined,
      })),
    );

    await ctx.editMessageText(
      "Yuqoridagi mashina e'loni asosiy kanalga joylandi ✅",
    );
  }

  @Action(/rejectCarAd/)
  async rejectCarAd(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');
    await this.carRepo.delete(id as string);
    await ctx.editMessageText("Yuqoridagi mashina e'loni bekor qilindi ❌");
  }
}
