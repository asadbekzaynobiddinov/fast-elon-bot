import { InjectRepository } from '@nestjs/typeorm';
import { Scene, SceneEnter, Ctx, On, Command } from 'nestjs-telegraf';
import {
  additionalInfo,
  addressMessage,
  askHomePicturesMessage,
  contactInfoMessage,
  doneMessage,
  floorMessage,
  floorsMessage,
  minPicLeghth,
  priceMessage,
  roomsMessage,
  squareMessage,
  userMainMessage,
  usersMenu,
} from 'src/common/constants';
import { ContextType } from 'src/common/types';
import { Home, HomeRepository } from 'src/core';
import { config } from 'src/config';
import { Markup } from 'telegraf';
import { HomeType } from 'src/common/enum';
import {
  contactButton,
  floorMenu,
  homeAddressMenu,
  roomsMenu,
} from 'src/common/constants/user/keyboards/home.keys';

@Scene('homeScene')
export class HomeScene {
  constructor(
    @InjectRepository(Home) private readonly homeRepo: HomeRepository,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(
      askHomePicturesMessage[ctx.session.lang] as string,
      {
        parse_mode: 'HTML',
      },
    );
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: ContextType) {
    try {
      const photo = (
        ctx.update as { message: { photo: { file_id: string }[] } }
      ).message.photo;

      const fileId: string = photo[photo.length - 1].file_id;

      const homeAd = await this.homeRepo.findOne({
        where: { id: ctx.session.home_id },
      });

      if (homeAd?.last_state != 'awaitPictures') {
        return;
      }

      ctx.session.home_photos.push(fileId);
    } catch (error) {
      console.error('Rasm qabul qilishda xato:', error);
    }
  }

  @Command('cancel')
  async cancel(@Ctx() ctx: ContextType) {
    await this.homeRepo.delete({ id: ctx.session.home_id });
    ctx.session.home_id = '';
    ctx.session.home_photos = [];
    ctx.session.lastMessage = await ctx.reply(
      userMainMessage[ctx.session.lang] as string,
      {
        reply_markup: usersMenu[ctx.session.lang],
      },
    );
    await ctx.scene.leave();
  }

  @Command('done')
  async done(@Ctx() ctx: ContextType) {
    const homeAdd = await this.homeRepo.findOne({
      where: { id: ctx.session.home_id },
    });

    if (!homeAdd) {
      return;
    }

    if (ctx.session.home_photos.length < 3) {
      await ctx.reply(minPicLeghth[ctx.session.lang] as string);
      return;
    }
    homeAdd.last_state = 'awaitAddress';
    homeAdd.pictures = ctx.session.home_photos;
    await this.homeRepo.save(homeAdd);
    ctx.session.home_photos = [];
    await ctx.reply(addressMessage[ctx.session.lang] as string, {
      reply_markup: homeAddressMenu[ctx.session.lang].reply_markup,
      parse_mode: 'HTML',
    });
  }

  @On('contact')
  async onContact(@Ctx() ctx: ContextType) {
    const homeAd = await this.homeRepo.findOne({
      where: { id: ctx.session.home_id },
    });
    if (!homeAd || homeAd.last_state !== 'awaitContactInfo') {
      return;
    }
    homeAd.number_for_contact = (
      ctx.update as {
        message: { contact: { phone_number: string } };
      }
    ).message.contact.phone_number;
    homeAd.last_state = 'awaitAdditional';
    await this.homeRepo.save(homeAd);
    await ctx.reply(
      additionalInfo[ctx.session.lang] as string,
      Markup.removeKeyboard(),
    );
    return;
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const homeAdd = await this.homeRepo.findOne({
      where: { id: ctx.session.home_id },
    });
    if (!homeAdd) {
      return;
    }
    switch (homeAdd.last_state) {
      case 'awaitAddress': {
        const address = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.location = address;
        homeAdd.last_state = 'awaitFloors';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(floorsMessage[ctx.session.lang] as string, floorMenu);
        return;
      }
      case 'awaitFloors': {
        const floors = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.floors_of_building = floors;
        homeAdd.last_state = 'awaitFloor';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(floorMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitFloor': {
        const floor = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.floor_number = floor;
        homeAdd.last_state = 'awaitRooms';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(roomsMessage[ctx.session.lang] as string, roomsMenu);
        return;
      }
      case 'awaitRooms': {
        const rooms = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.rooms = rooms;
        homeAdd.last_state = 'awaitSquare';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(
          squareMessage[ctx.session.lang] as string,
          Markup.removeKeyboard(),
        );
        return;
      }
      case 'awaitSquare': {
        const square = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.square = square;
        homeAdd.last_state = 'awaitPrice';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(priceMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitPrice': {
        const price = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.price = price;
        homeAdd.last_state = 'awaitContactInfo';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(contactInfoMessage[ctx.session.lang] as string, {
          reply_markup: {
            keyboard: [
              [
                Markup.button.contactRequest(
                  contactButton[ctx.session.lang] as string,
                ),
              ],
            ],
            resize_keyboard: true,
          },
          parse_mode: 'HTML',
        });

        return;
      }
      case 'awaitContactInfo': {
        const phone = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.number_for_contact = phone;
        homeAdd.last_state = 'awaitAdditional';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(
          additionalInfo[ctx.session.lang] as string,
          Markup.removeKeyboard(),
        );
        return;
      }
      case 'awaitAdditional': {
        const information = (ctx.update as { message: { text: string } })
          .message.text;
        homeAdd.additional_information = information;
        homeAdd.last_state = 'done';
        await this.homeRepo.save(homeAdd);

        await ctx.sendMediaGroup(
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
                  `📞 <b>Bog'lanish uchun:</b> ${homeAdd.number_for_contact}\n` +
                  `ℹ️ <b>Qo'shimcha ma'lumotlar:</b> ${homeAdd.additional_information}`
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
          config.HOME_ADMIN_CHANEL,
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
                  `📞 <b>Bog'lanish uchun:</b> ${homeAdd.number_for_contact}\n` +
                  `ℹ️ <b>Qo'shimcha ma'lumotlar:</b> ${homeAdd.additional_information}`
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
                    `confirmHomeAsAdmin=${homeAdd.id}`,
                  ),
                  Markup.button.callback(
                    '❌ Rad etish',
                    `rejectHomeAsAdmin=${homeAdd.id}`,
                  ),
                ],
              ],
            },
          },
        );
        await ctx.scene.leave();
        return;
      }
    }
  }
}
