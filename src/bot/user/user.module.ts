import { Module } from '@nestjs/common';
import { UserCommandsModule } from './update/commands/user-commands.module';
import { UserActionsModule } from './update/actions/user-actions.module';
import { UserScenesModule } from './update/scenes/scene.module';

@Module({
  imports: [UserCommandsModule, UserActionsModule, UserScenesModule],
})
export class UserModule {}
