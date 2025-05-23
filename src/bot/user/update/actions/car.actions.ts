import { UseGuards } from '@nestjs/common';
import { Update, Action, Ctx } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextType } from 'src/common/types';
import { Car, CarRepository } from 'src/core';
import { LangGuard } from 'src/common/guard/lang.guard';
import { LastMessageGuard } from 'src/common/guard/last-message.guard';

@UseGuards(LangGuard)
@UseGuards(LastMessageGuard)
@Update()
export class UserCarActions {
  constructor(@InjectRepository(Car) private readonly carRepo: CarRepository) {}
  @Action('cars')
  async cars(@Ctx() ctx: ContextType) {
    const newCar = this.carRepo.create({
      last_state: 'awaitPictures',
      pictures: [],
      user_id: `${ctx.from?.id}`,
    });
    await this.carRepo.save(newCar);
    ctx.session.car_id = newCar.id;
    await ctx.scene.enter('carScene');
  }
}
