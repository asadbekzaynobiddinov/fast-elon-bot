import { Action, Update, Ctx } from 'nestjs-telegraf';
import { shopMessage } from 'src/common/constants';
import { ContextType } from 'src/common/types';
import { UseGuards } from '@nestjs/common';
import { LangGuard } from 'src/common/guard/lang.guard';
import { LastMessageGuard } from 'src/common/guard/last-message.guard';

@UseGuards(LangGuard)
@UseGuards(LastMessageGuard)
@Update()
export class UserShopActions {
  @Action('shops')
  async shops(@Ctx() ctx: ContextType) {
    await ctx.answerCbQuery(shopMessage[ctx.session.lang] as string, {
      show_alert: true,
    });
  }
}
