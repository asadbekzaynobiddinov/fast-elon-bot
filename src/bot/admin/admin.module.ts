import { Module } from '@nestjs/common';
import { AdminActionsModule } from './update/actions/admin-actions.module';
import { AdminCommandsModule } from './update/commands/admin-command.module';
import { AdminSceneModule } from './update/scenes/admin-scene.module';

@Module({
  imports: [AdminActionsModule, AdminCommandsModule, AdminSceneModule],
})
export class AdminModule {}
