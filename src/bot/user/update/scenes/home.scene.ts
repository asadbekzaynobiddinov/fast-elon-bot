import { InjectRepository } from '@nestjs/typeorm';
import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';
import {
  additionalInfo,
  addressMessage,
  askHomePicturesMessage,
  contactInfoMessage,
  doneMessage,
  floorMessage,
  floorsMessage,
  priceMessage,
  roomsMessage,
  squareMessage,
  userMainMessage,
  usersMenu,
} from 'src/common/constants';
import { ContextType } from 'src/common/types';
import { Home, HomeRepository } from 'src/core';
import { config } from 'src/config';

@Scene('homeScene')
export class HomeScene {
  constructor(
    @InjectRepository(Home) private readonly homeRepo: HomeRepository,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(
      askHomePicturesMessage[ctx.session.lang] as string,
    );
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: ContextType) {
    try {
      // Rasm ma'lumotlarini olish
      const photo = (
        ctx.update as { message: { photo: { file_id: string }[] } }
      ).message.photo;

      // Eng yuqori sifatli rasmni olish (oxirgi element)
      const fileId: string = photo[photo.length - 1].file_id;

      // Uy e'lonini bazadan topish
      const homeAd = await this.homeRepo.findOne({
        where: { id: ctx.session.home_id },
      });

      // Agar holat "rasmlarKutilmoqda" bo'lmasa, to'xtatish
      if (homeAd?.last_state != 'awaitPictures') {
        return;
      }

      // Transaction (tranzaksiya) yaratish - ma'lumotlar bazasida xatolikni oldini olish
      await this.homeRepo.manager.transaction(
        async (transactionalEntityManager) => {
          // Yangi uy e'lonini yuklab olish (boshqa o'zgarishlarni yo'qotmaslik uchun)
          const freshHomeAd = await transactionalEntityManager.findOne(Home, {
            where: { id: ctx.session.home_id },
          });

          if (freshHomeAd) {
            // Rasm ID sini qo'shish
            freshHomeAd.pictures.push(fileId);
            await transactionalEntityManager.save(freshHomeAd);

            // Agar 3 yoki undan ko'p rasm bo'lsa, holatni o'zgartirish
            if (freshHomeAd.pictures.length >= 3) {
              freshHomeAd.last_state = 'awaitAddress';
              await transactionalEntityManager.save(freshHomeAd);
              await ctx.reply(addressMessage[ctx.session.lang] as string);
            }
          }
        },
      );
    } catch (error) {
      console.error('Rasm qabul qilishda xato:', error);
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const homeAdd = await this.homeRepo.findOne({
      where: { id: ctx.session.home_id },
    });
    if (!homeAdd) {
      console.log('topilmadi');
      return;
    }
    switch (homeAdd.last_state) {
      case 'awaitAddress': {
        const address = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.location = address;
        homeAdd.last_state = 'awaitFloors';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(floorsMessage[ctx.session.lang] as string);
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
        await ctx.reply(roomsMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitRooms': {
        const rooms = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.rooms = rooms;
        homeAdd.last_state = 'awaitSquare';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(squareMessage[ctx.session.lang] as string);
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
        await ctx.reply(contactInfoMessage[ctx.session.lang] as string);
        return;
      }
      case 'awaitContactInfo': {
        const phone = (ctx.update as { message: { text: string } }).message
          .text;
        homeAdd.number_for_contact = phone;
        homeAdd.last_state = 'awaitAdditional';
        await this.homeRepo.save(homeAdd);
        await ctx.reply(additionalInfo[ctx.session.lang] as string);
        return;
      }
      case 'awaitAdditional': {
        const information = (ctx.update as { message: { text: string } })
          .message.text;
        homeAdd.additional_information = information;
        homeAdd.last_state = 'done';
        await this.homeRepo.save(homeAdd);
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
            caption:
              index === 0
                ? '🆔 Id: ' +
                  homeAdd.id +
                  '\n\n' +
                  '📍 Manzil: ' +
                  homeAdd.location +
                  '\n' +
                  '🏢 Qavatlar: ' +
                  homeAdd.floors_of_building +
                  '\n' +
                  '🏬 Qavat: ' +
                  homeAdd.floor_number +
                  '\n' +
                  '🛏️ Xonalar: ' +
                  homeAdd.rooms +
                  '\n' +
                  '📐 Maydon: ' +
                  homeAdd.square +
                  '\n' +
                  '💰 Narx: ' +
                  homeAdd.price +
                  '\n' +
                  '📞 Aloqa raqami: ' +
                  homeAdd.number_for_contact +
                  '\n' +
                  "ℹ️ Qo'shimcha ma'lumot: " +
                  homeAdd.additional_information
                : undefined,
            reply_markup:
              index === 0
                ? {
                    inline_keyboard: [
                      [
                        {
                          text: '✅ Accept',
                          callback_data: `accept_${homeAdd.id}`,
                        },
                        {
                          text: '❌ Reject',
                          callback_data: `reject_${homeAdd.id}`,
                        },
                      ],
                    ],
                  }
                : undefined,
          })),
        );
        await ctx.scene.leave();
        return;
      }
    }
  }
}
