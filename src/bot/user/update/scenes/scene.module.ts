import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home, Phone } from 'src/core';
import { HomeScene } from './home.scene';
import { PhoneScene } from './phone.scenee';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Phone])],
  providers: [HomeScene, PhoneScene],
})
export class UserScenesModule {}
