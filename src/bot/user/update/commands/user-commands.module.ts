import { Module } from '@nestjs/common';
import { UserCommands } from './user.commands';

@Module({
  providers: [UserCommands],
})
export class UserCommandsModule {}
