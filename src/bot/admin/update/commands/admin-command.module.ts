import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, Home, Store } from 'src/core';
import { AdminCommands } from './admin.command';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Home, Store])],
  providers: [AdminCommands],
})
export class AdminCommandsModule {}
