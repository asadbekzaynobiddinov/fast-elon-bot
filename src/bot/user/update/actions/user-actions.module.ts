import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Home } from 'src/core';
import { UserLangActions } from './user-lang.actions';
import { HomeActions } from './home.actions';

@Module({
  imports: [TypeOrmModule.forFeature([User, Home])],
  providers: [UserLangActions, HomeActions],
})
export class UserActionsModule {}
