import { Module } from '@nestjs/common';
import { UserCommandsModule } from './update/commands/user-commands.module';
import { UserActionsModule } from './update/actions/user-actions.module';

@Module({
  imports: [UserCommandsModule, UserActionsModule],
})
export class UserModule {}
