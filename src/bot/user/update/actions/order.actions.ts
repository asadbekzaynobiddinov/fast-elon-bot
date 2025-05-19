import { UseGuards } from '@nestjs/common';
import { Update, Ctx, Action } from 'nestjs-telegraf';
import { orderMessage } from 'src/common/constants';
import { ContextType } from 'src/common/types';
import { LangGuard } from 'src/common/guard/lang.guard';
import { LastMessageGuard } from 'src/common/guard/last-message.guard';

@UseGuards(LangGuard)
@UseGuards(LastMessageGuard)
@Update()
export class UserOrderActions {
  @Action('order')
  async order(@Ctx() ctx: ContextType) {
    await ctx.answerCbQuery(orderMessage[ctx.session.lang] as string, {
      show_alert: true,
    });
  }
}
