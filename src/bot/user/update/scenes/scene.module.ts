import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from 'src/core';
import { HomeScene } from './home.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Home])],
  providers: [HomeScene],
})
export class UserScenesModule {}
