import { InjectRepository } from '@nestjs/typeorm';
import { Scene, SceneEnter, On, Ctx, Command } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import {
  contactInfoMessage,
  doneMessage,
  minPicLeghth,
  phoneBatteryConditionMessage,
  phoneBoxAndDocumentMessage,
  phoneColorMessage,
  phoneConditionMessage,
  phoneImageMessage,
  phoneMemoryMessage,
  phoneNameMessage,
  phonePriceMessage,
  phoneRegionMessage,
  userMainMessage,
  usersMenu,
} from 'src/common/constants';
import { ContextType } from 'src/common/types';
import { config } from 'src/config';
import { Phone, PhoneRepository } from 'src/core';

@Scene('phoneScene')
export class PhoneScene {
  constructor(
    @InjectRepository(Phone) private readonly phoneRepo: PhoneRepository,
  ) {}

  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(phoneImageMessage[ctx.session.lang] as string, {
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

      console.log('rasm qabul qilindi', fileId);

      const phoneAd = await this.phoneRepo.findOne({
        where: { id: ctx.session.phone_id },
      });

      if (phoneAd?.last_state != 'awaitPictures') {
        return;
      }

      ctx.session.phone_photos.push(fileId);
    } catch (error) {
      console.error('Rasm qabul qilishda xato:', error);
    }
  }

  @Command('done')
  async done(@Ctx() ctx: ContextType) {
    const phoneAd = await this.phoneRepo.findOne({
      where: { id: ctx.session.phone_id },
    });

    console.log(phoneAd);

    if (!phoneAd) {
      return;
    }

    if (ctx.session.phone_photos.length < 3) {
      await ctx.reply(minPicLeghth[ctx.session.lang] as string);
      return;
    }
    phoneAd.last_state = 'awaitName';
    phoneAd.pictures = ctx.session.phone_photos;
    await this.phoneRepo.save(phoneAd);
    ctx.session.phone_photos = [];
    await ctx.reply(phoneNameMessage[ctx.session.lang] as string);
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const phoneAd = await this.phoneRepo.findOne({
      where: { id: ctx.session.phone_id },
    });

    if (!phoneAd) {
      return;
    }

    switch (phoneAd.last_state) {
      case 'awaitName': {
        const name = (ctx.update as { message: { text: string } }).message.text;
        phoneAd.name = name;
        phoneAd.last_state = 'awaitCondition';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(phoneConditionMessage[ctx.session.lang] as string);
        break;
      }
      case 'awaitCondition': {
        const condition = (ctx.update as { message: { text: string } }).message
          .text;
        phoneAd.condition = condition;
        phoneAd.last_state = 'awaitMemory';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(phoneMemoryMessage[ctx.session.lang] as string);
        break;
      }
      case 'awaitMemory': {
        const memory = (ctx.update as { message: { text: string } }).message
          .text;
        phoneAd.memory = memory;
        phoneAd.last_state = 'awaitColor';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(phoneColorMessage[ctx.session.lang] as string);
        break;
      }
      case 'awaitColor': {
        const color = (ctx.update as { message: { text: string } }).message
          .text;
        phoneAd.color = color;
        phoneAd.last_state = 'awaitBoxAndDocuments';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(phoneBoxAndDocumentMessage[ctx.session.lang] as string);
        break;
      }
      case 'awaitBoxAndDocuments': {
        const boxAndDocuments = (ctx.update as { message: { text: string } })
          .message.text;
        phoneAd.box_and_documents = boxAndDocuments;
        phoneAd.last_state = 'awaitBatteryCondition';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(
          phoneBatteryConditionMessage[ctx.session.lang] as string,
        );
        break;
      }
      case 'awaitBatteryCondition': {
        const batteryCondition = (ctx.update as { message: { text: string } })
          .message.text;
        phoneAd.battery_condition = batteryCondition;
        phoneAd.last_state = 'awaitRegion';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(phoneRegionMessage[ctx.session.lang] as string);
        break;
      }
      case 'awaitRegion': {
        const region = (ctx.update as { message: { text: string } }).message
          .text;
        phoneAd.region = region;
        phoneAd.last_state = 'awaitContact';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(contactInfoMessage[ctx.session.lang] as string);
        break;
      }
      case 'awaitContact': {
        const contact = (ctx.update as { message: { text: string } }).message
          .text;
        phoneAd.contact_number = contact;
        phoneAd.last_state = 'awaitPrice';
        await this.phoneRepo.save(phoneAd);
        await ctx.reply(phonePriceMessage[ctx.session.lang] as string);
        break;
      }
      case 'awaitPrice': {
        const price = (ctx.update as { message: { text: string } }).message
          .text;
        phoneAd.price = price;
        phoneAd.last_state = 'done';
        await this.phoneRepo.save(phoneAd);

        await ctx.sendMediaGroup(
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
                  `💵 <b>Narxi:</b> ${phoneAd.price}`
                : undefined,
          })),
        );

        await ctx.reply(doneMessage[ctx.session.lang] as string);
        ctx.session.lastMessage = await ctx.reply(
          userMainMessage[ctx.session.lang] as string,
          {
            reply_markup: usersMenu[ctx.session.lang],
          },
        );

        await ctx.telegram.sendMediaGroup(
          config.PHONE_ADMIN_CHANEL,
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
                  `💵 <b>Narxi:</b> ${phoneAd.price}`
                : undefined,
          })),
        );
        await ctx.telegram.sendMessage(
          config.HOME_ADMIN_CHANEL,
          "Yuqoridagi rasmda ko'rsatilgan ma'lumotlar bilan yangi e'lon berildi. 👆",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  Markup.button.callback(
                    '✅ Tasdiqlash',
                    `confirmPhoneAsAdmin=${phoneAd.id}`,
                  ),
                  Markup.button.callback(
                    '❌ Rad etish',
                    `rejectPhoneAsAdmin=${phoneAd.id}`,
                  ),
                ],
              ],
            },
          },
        );
        await ctx.scene.leave();
      }
    }
  }
}
