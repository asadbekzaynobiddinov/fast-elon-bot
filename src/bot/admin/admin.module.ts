import { Module } from '@nestjs/common';
import { AdminActionsModule } from './update/actions/admin-actions.module';

@Module({
  imports: [AdminActionsModule],
})
export class AdminModule {}
