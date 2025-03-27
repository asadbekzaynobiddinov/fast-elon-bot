import { Module } from '@nestjs/common';
import { UserCommands } from './user.commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserCommands],
})
export class UserCommandsModule {}
