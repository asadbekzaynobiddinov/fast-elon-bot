import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Home, Phone, Work } from 'src/core';
import { AdminHomeActions } from './admin-home-actions';
import { AdminPhoneActions } from './admin-phone-actions';
import { AdminCarActions } from './admin-car-actions';
import { AdminWorkActions } from './admin-work-actions';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Phone, Car, Work])],
  providers: [
    AdminHomeActions,
    AdminPhoneActions,
    AdminCarActions,
    AdminWorkActions,
  ],
})
export class AdminActionsModule {}
