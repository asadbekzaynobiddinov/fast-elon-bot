import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Home, Phone } from 'src/core';
import { HomeScene } from './home.scene';
import { PhoneScene } from './phone.scenee';
import { CarScene } from './car.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Phone, Car])],
  providers: [HomeScene, PhoneScene, CarScene],
})
export class UserScenesModule {}
