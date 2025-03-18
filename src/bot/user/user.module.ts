import { Module } from '@nestjs/common';
import { UserCommands } from './update/commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core';
import { CacheModule } from '@nestjs/cache-manager';
import { LanguageActions } from './update/actions/language.actions';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CacheModule.register()],
  providers: [UserCommands, LanguageActions],
})
export class UserModule {}
