import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home, Store } from 'src/core';
import { AdminHomeScene } from './home.scene';
import { AdminStoreScene } from './store.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Store])],
  providers: [AdminHomeScene, AdminStoreScene],
})
export class AdminSceneModule {}
