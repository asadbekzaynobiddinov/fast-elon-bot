import { UseGuards } from '@nestjs/common';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { userMainMessage, usersMenu, workMenu } from 'src/common/constants';
import { LangGuard } from 'src/common/guard/lang-guard';
import { ContextType } from 'src/common/types';

@UseGuards(LangGuard)
@Update()
export class UserWorkActions {
  @Action('work')
  async work(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: workMenu[ctx.session.lang],
    });
  }

  @Action('workEmployer')
  async workEmployer(@Ctx() ctx: ContextType) {
    await ctx.answerCbQuery("Ish beruvchi bo'lishni tanladingiz");
  }

  @Action('workJobSeeker')
  async workJobSeeker(@Ctx() ctx: ContextType) {
    await ctx.answerCbQuery("Ish izlovchi bo'lishni tanladingiz");
  }

  @Action('backFromWorkMenu')
  async backFromWorkMenu(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(userMainMessage[ctx.session.lang] as string, {
      reply_markup: usersMenu[ctx.session.lang],
    });
  }
}
