import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { homeMenu, userMainMessage, usersMenu } from 'src/common/constants';
import { Home, HomeRepository } from 'src/core';
import { ContextType } from 'src/common/types';
import { UseGuards } from '@nestjs/common';
import { LangGuard } from 'src/common/guard/lang.guard';
import { HomeType } from 'src/common/enum';
import { LastMessageGuard } from 'src/common/guard/last-message.guard';

@UseGuards(LangGuard)
@UseGuards(LastMessageGuard)
@Update()
export class UserHomeActions {
  constructor(
    @InjectRepository(Home) private readonly homeRepo: HomeRepository,
  ) {}
  @Action('home')
  async home(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: homeMenu[ctx.session.lang],
    });
  }

  @Action('realEstate')
  async realEstate(@Ctx() ctx: ContextType) {
    const newHome = this.homeRepo.create({
      type: HomeType.REAL_ESTATE,
      last_state: 'awaitPictures',
      pictures: [],
      user_id: `${ctx.from?.id}`,
    });
    await this.homeRepo.save(newHome);
    ctx.session.home_id = newHome.id;
    await ctx.scene.enter('homeScene');
  }

  @Action('rent')
  async rent(@Ctx() ctx: ContextType) {
    const newHome = this.homeRepo.create({
      type: HomeType.RENT,
      last_state: 'awaitPictures',
      pictures: [],
      user_id: `${ctx.from?.id}`,
    });
    await this.homeRepo.save(newHome);
    ctx.session.home_id = newHome.id;
    await ctx.scene.enter('homeScene');
  }

  @Action('backFromHomeMenu')
  async backFromHomeMenu(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: usersMenu[ctx.session.lang],
    });
  }
}
