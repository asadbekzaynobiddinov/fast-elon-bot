import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Home, Phone, Car, Work } from 'src/core';
import { UserLangActions } from './user-lang.actions';
import { UserHomeActions } from './home.actions';
import { UserPhoneActions } from './phone.actions';
import { UserCarActions } from './car.actions';
import { UserWorkActions } from './wok.actions';

@Module({
  imports: [TypeOrmModule.forFeature([User, Home, Phone, Car, Work])],
  providers: [
    UserLangActions,
    UserHomeActions,
    UserPhoneActions,
    UserCarActions,
    UserWorkActions,
  ],
})
export class UserActionsModule {}
