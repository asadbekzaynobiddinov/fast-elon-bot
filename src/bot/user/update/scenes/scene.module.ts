import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Home, Phone, Work } from 'src/core';
import { HomeScene } from './home.scene';
import { PhoneScene } from './phone.scenee';
import { CarScene } from './car.scene';
import { WorkScene } from './work.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Phone, Car, Work])],
  providers: [HomeScene, PhoneScene, CarScene, WorkScene],
})
export class UserScenesModule {}
