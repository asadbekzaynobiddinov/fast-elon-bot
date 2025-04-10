import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from 'src/core';
import { AdminHomeActions } from './admin-home-actions';

@Module({
  imports: [TypeOrmModule.forFeature([Home])],
  providers: [AdminHomeActions],
})
export class AdminActionsModule {}
