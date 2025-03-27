import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core';
import { UserLangActions } from './user-lang.actions';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserLangActions],
})
export class UserActionsModule {}
