import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from 'src/config/telegraf.options';
import { UserModule } from './user/user.module';

@Module({
  imports: [TelegrafModule.forRootAsync(options()), UserModule],
})
export class BotModule {}
