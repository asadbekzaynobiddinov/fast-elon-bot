import { Scene, SceneEnter, On, Command, Ctx } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import {
  carAdditionalInfoMessage,
  carBodyCondition,
  carColorMessage,
  carConditionMessage,
  carMilageMessage,
  carNameMessage,
  carPictureMessage,
  carPriceMessage,
  carRegionMessage,
  carYearMessage,
  contactInfoMessage,
  doneMessage,
  minPicLeghth,
  userMainMessage,
  usersMenu,
} from 'src/common/constants';
import { Car, CarRepository } from 'src/core';
import { ContextType } from 'src/common/types';
import { config } from 'src/config';
import { Markup } from 'telegraf';

@Scene('carScene')
export class CarScene {
  constructor(@InjectRepository(Car) private readonly carRepo: CarRepository) {}
  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(carPictureMessage[ctx.session.lang] as string, {
      parse_mode: 'HTML',
    });
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: ContextType) {
    try {
      const photo = (
        ctx.update as { message: { photo: { file_id: string }[] } }
      ).message.photo;

      const fileId: string = photo[photo.length - 1].file_id;

      const carAd = await this.carRepo.findOne({
        where: { id: ctx.session.car_id },
      });

      if (carAd?.last_state != 'awaitPictures') {
        return;
      }

      ctx.session.car_photos.push(fileId);
    } catch (error) {
      console.error('Rasm qabul qilishda xato:', error);
    }
  }

  @Command('done')
  async done(@Ctx() ctx: ContextType) {
    const carAd = await this.carRepo.findOne({
      where: { id: ctx.session.car_id },
    });

    if (!carAd) {
      return;
    }

    if (ctx.session.car_photos.length < 3) {
      await ctx.reply(minPicLeghth[ctx.session.lang] as string);
      return;
    }
    carAd.last_state = 'awaitName';
    carAd.pictures = ctx.session.car_photos;
    await this.carRepo.save(carAd);
    ctx.session.car_photos = [];
    await ctx.reply(carNameMessage[ctx.session.lang] as string);
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const carAd = await this.carRepo.findOne({
      where: { id: ctx.session.car_id },
    });

    if (!carAd) {
      return;
    }

    switch (carAd.last_state) {
      case 'awaitName': {
        const name = (ctx.update as { message: { text: string } }).message.text;
        carAd.name = name;
        carAd.last_state = 'awaitYear';
        await this.carRepo.save(carAd);
        await ctx.reply(carYearMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitYear': {
        const year = (ctx.update as { message: { text: string } }).message.text;
        carAd.year = year;
        carAd.last_state = 'awaitMilage';
        await this.carRepo.save(carAd);
        await ctx.reply(carMilageMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitMilage': {
        const milage = (ctx.update as { message: { text: string } }).message
          .text;
        carAd.mileage = milage;
        carAd.last_state = 'awaitCondition';
        await this.carRepo.save(carAd);
        await ctx.reply(carConditionMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitCondition': {
        const condition = (ctx.update as { message: { text: string } }).message
          .text;
        carAd.condition = condition;
        carAd.last_state = 'awaitBodyCondition';
        await this.carRepo.save(carAd);
        await ctx.reply(carBodyCondition[ctx.session.lang] as string);
        return;
      }
      case 'awaitBodyCondition': {
        const bodyCondition = (ctx.update as { message: { text: string } })
          .message.text;
        carAd.body_condition = bodyCondition;
        carAd.last_state = 'awaitColor';
        await this.carRepo.save(carAd);
        await ctx.reply(carColorMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitColor': {
        const color = (ctx.update as { message: { text: string } }).message
          .text;
        carAd.color = color;
        carAd.last_state = 'awaitRegion';
        await this.carRepo.save(carAd);
        await ctx.reply(carRegionMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitRegion': {
        const region = (ctx.update as { message: { text: string } }).message
          .text;
        carAd.region = region;
        carAd.last_state = 'awaitPrice';
        await this.carRepo.save(carAd);
        await ctx.reply(carPriceMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitPrice': {
        const price = (ctx.update as { message: { text: string } }).message
          .text;
        carAd.price = price;
        carAd.last_state = 'awaitAdditional';
        await this.carRepo.save(carAd);
        await ctx.reply(carAdditionalInfoMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitAdditional': {
        const additionInfo = (ctx.update as { message: { text: string } })
          .message.text;
        carAd.additonal_info = additionInfo;
        carAd.last_state = 'awaitContact';
        await this.carRepo.save(carAd);
        await ctx.reply(contactInfoMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitContact': {
        const contact = (ctx.update as { message: { text: string } }).message
          .text;
        carAd.contact_number = contact;
        carAd.last_state = 'done';
        await this.carRepo.save(carAd);

        await ctx.sendMediaGroup(
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

        await ctx.telegram.sendMediaGroup(
          config.CAR_ADMIN_CHANEL,
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

        await ctx.telegram.sendMessage(
          config.CAR_ADMIN_CHANEL,
          `Yuqoridagi ma'lumotlar bilan mashina e'loni berildi.\nTasdiqlaysizmi?`,
          Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '✅ Tasdiqlash',
                `acceptCarAd=${carAd.id}`,
              ),
              Markup.button.callback(
                '❌ Rad qilish',
                `rejectCarAd=${carAd.id}`,
              ),
            ],
          ]),
        );

        await ctx.reply(doneMessage[ctx.session.lang] as string);
        ctx.session.lastMessage = await ctx.reply(
          userMainMessage[ctx.session.lang] as string,
          {
            reply_markup: usersMenu[ctx.session.lang],
          },
        );

        return;
      }
    }
  }
}
