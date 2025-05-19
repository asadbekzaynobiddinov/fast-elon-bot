import { Module, OnModuleInit } from '@nestjs/common';
import { TelegrafModule, InjectBot } from 'nestjs-telegraf';
import { options } from 'src/config/telegraf.options';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { Telegraf } from 'telegraf';

@Module({
  imports: [TelegrafModule.forRootAsync(options()), UserModule, AdminModule],
})
export class BotModule implements OnModuleInit {
  constructor(@InjectBot() private readonly bot: Telegraf) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Botni ishga tushurish' },
    ]);
  }
}
