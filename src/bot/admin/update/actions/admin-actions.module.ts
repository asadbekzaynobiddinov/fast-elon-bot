import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home, Phone } from 'src/core';
import { AdminHomeActions } from './admin-home-actions';
import { AdminPhoneActions } from './admin-phone-actions';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Phone])],
  providers: [AdminHomeActions, AdminPhoneActions],
})
export class AdminActionsModule {}
