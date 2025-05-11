import { Module } from '@nestjs/common';
import { AdminActionsModule } from './update/actions/admin-actions.module';
import { AdminCommandsModule } from './update/commands/admin.module';

@Module({
  imports: [AdminActionsModule, AdminCommandsModule],
})
export class AdminModule {}
