import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Home, Phone, Car, Work, Store } from 'src/core';
import { UserLangActions } from './user-lang.actions';
import { UserHomeActions } from './home.actions';
import { UserPhoneActions } from './phone.actions';
import { UserCarActions } from './car.actions';
import { UserWorkActions } from './wok.actions';
import { UserOrderActions } from './order.actions';
import { UserShopActions } from './shop.actions';
import { UserSettingsActions } from './settings.actions';

@Module({
  imports: [TypeOrmModule.forFeature([User, Home, Phone, Car, Work, Store])],
  providers: [
    UserLangActions,
    UserHomeActions,
    UserPhoneActions,
    UserCarActions,
    UserWorkActions,
    UserOrderActions,
    UserShopActions,
    UserSettingsActions,
  ],
})
export class UserActionsModule {}
