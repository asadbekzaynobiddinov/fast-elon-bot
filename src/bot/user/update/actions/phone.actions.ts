import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import {
  phoneMenu,
  userMainMessage,
  additionalKeyForPhone,
  backFromPhomeMenu,
  usersMenu,
} from 'src/common/constants';
import { PhoneType } from 'src/common/enum';
import { LangGuard } from 'src/common/guard/lang.guard';
import { LastMessageGuard } from 'src/common/guard/last-message.guard';
import { ContextType } from 'src/common/types';
import { config } from 'src/config';
import { Phone, PhoneRepository } from 'src/core';
import { Markup } from 'telegraf';

@UseGuards(LangGuard)
@UseGuards(LastMessageGuard)
@Update()
export class UserPhoneActions {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepo: PhoneRepository,
  ) {}

  @Action('phones')
  async handlePhoneAction(ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: {
        inline_keyboard: [
          ...phoneMenu[ctx.session.lang].inline_keyboard,
          [
            Markup.button.url(
              additionalKeyForPhone[ctx.session.lang] as string,
              config.PHONE_MAIN_URL,
            ),
            Markup.button.callback(
              backFromPhomeMenu[ctx.session.lang] as string,
              'backFromPhoneMenu',
            ),
          ],
        ],
      },
    });
  }

  @Action('iphone')
  async iphone(@Ctx() ctx: ContextType) {
    const newPhone = this.phoneRepo.create({
      type: PhoneType.IPHONE,
      last_state: 'awaitPictures',
      pictures: [],
      user_id: `${ctx.from?.id}`,
    });
    await this.phoneRepo.save(newPhone);
    ctx.session.phone_id = newPhone.id;
    await ctx.scene.enter('phoneScene');
  }

  @Action('android')
  async android(@Ctx() ctx: ContextType) {
    const newPhone = this.phoneRepo.create({
      type: PhoneType.ANDROID,
      last_state: 'awaitPictures',
      pictures: [],
      user_id: `${ctx.from?.id}`,
    });
    await this.phoneRepo.save(newPhone);
    ctx.session.phone_id = newPhone.id;
    await ctx.scene.enter('phoneScene');
  }

  @Action('backFromPhoneMenu')
  async backFromPhoneMenu(ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: usersMenu[ctx.session.lang],
    });
  }
}
