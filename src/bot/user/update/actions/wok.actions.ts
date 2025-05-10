import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { userMainMessage, usersMenu, workMenu } from 'src/common/constants';
import { LangGuard } from 'src/common/guard/lang-guard';
import { ContextType } from 'src/common/types';
import { Work, WorkRepository } from 'src/core';
import { WorkType } from 'src/common/enum';

@UseGuards(LangGuard)
@Update()
export class UserWorkActions {
  constructor(
    @InjectRepository(Work) private readonly workRepo: WorkRepository,
  ) {}
  @Action('work')
  async work(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: workMenu[ctx.session.lang],
    });
  }

  @Action('workEmployer')
  async workEmployer(@Ctx() ctx: ContextType) {
    const newWorkAd = this.workRepo.create({
      type: WorkType.WORKJOBEMPLOYER,
      title: 'Xodim kerak',
      last_state: 'awaitName',
    });
    await this.workRepo.save(newWorkAd);
    ctx.session.work_id = newWorkAd.id;
    await ctx.scene.enter('workScene');
  }

  @Action('workJobSeeker')
  async workJobSeeker(@Ctx() ctx: ContextType) {
    const newWorkAd = this.workRepo.create({
      type: WorkType.WORKJOBSEEKER,
      title: 'Ish joyi kerak',
      last_state: 'awaitName',
    });
    await this.workRepo.save(newWorkAd);
    ctx.session.work_id = newWorkAd.id;
    await ctx.scene.enter('workScene');
  }

  @Action('backFromWorkMenu')
  async backFromWorkMenu(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: usersMenu[ctx.session.lang],
    });
  }
}
