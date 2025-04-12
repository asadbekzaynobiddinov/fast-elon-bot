import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Home, Phone } from 'src/core';
import { UserLangActions } from './user-lang.actions';
import { HomeActions } from './home.actions';
import { UserPhoneActions } from './phone.actions';

@Module({
  imports: [TypeOrmModule.forFeature([User, Home, Phone])],
  providers: [UserLangActions, HomeActions, UserPhoneActions],
})
export class UserActionsModule {}
