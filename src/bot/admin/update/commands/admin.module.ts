import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, Home } from 'src/core';
import { AdminCommands } from './admin.command';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Home])],
  providers: [AdminCommands],
})
export class AdminCommandsModule {}
