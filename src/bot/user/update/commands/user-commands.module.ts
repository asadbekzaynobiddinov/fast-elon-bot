import { Module } from '@nestjs/common';
import { UserCommands } from './user.commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Admin } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin])],
  providers: [UserCommands],
})
export class UserCommandsModule {}
