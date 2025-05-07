import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Home, Phone } from 'src/core';
import { AdminHomeActions } from './admin-home-actions';
import { AdminPhoneActions } from './admin-phone-actions';
import { AdminCarActions } from './admin-car-actions';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Phone, Car])],
  providers: [AdminHomeActions, AdminPhoneActions, AdminCarActions],
})
export class AdminActionsModule {}
