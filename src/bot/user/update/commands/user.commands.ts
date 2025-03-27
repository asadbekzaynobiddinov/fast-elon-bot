import { Update, Command, Ctx } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types/indeex';

@Update()
export class UserCommands {
  @Command('start')
  async start(@Ctx() ctx: ContextType) {
    await ctx.reply('Welcome to the bot! Use /help to see available commands.');
  }
}
