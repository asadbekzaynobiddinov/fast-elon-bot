import { InjectRepository } from '@nestjs/typeorm';
import { Scene, SceneEnter, On, Ctx, Command } from 'nestjs-telegraf';
import {
  minPicLeghth,
  phoneNameMessage,
  phonePriceMessage,
} from 'src/common/constants';
import { ContextType } from 'src/common/types';
import { Phone, PhoneRepository } from 'src/core';

@Scene('phoneScene')
export class PhoneScene {
  constructor(
    @InjectRepository(Phone) private readonly phoneRepo: PhoneRepository,
  ) {}

  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(phonePriceMessage[ctx.session.lang] as string, {
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

      phoneAd.pictures.push(fileId);
      await this.phoneRepo.save(phoneAd);
    } catch (error) {
      console.error('Rasm qabul qilishda xato:', error);
    }
  }

  @Command('done')
  async done(@Ctx() ctx: ContextType) {
    const phoneAd = await this.phoneRepo.findOne({
      where: { id: ctx.session.home_id },
    });

    if (!phoneAd) {
      return;
    }

    if ((phoneAd?.pictures ?? []).length < 3) {
      await ctx.reply(minPicLeghth[ctx.session.lang] as string);
      return;
    }
    phoneAd.last_state = 'awaitName';
    await this.phoneRepo.save(phoneAd);
    await ctx.reply(phoneNameMessage[ctx.session.lang] as string);
  }
}
