import { InjectRepository } from '@nestjs/typeorm';
import { Update, Action, Ctx } from 'nestjs-telegraf';
import { UserLang } from 'src/common/enum';
import { ContextType } from 'src/common/types/indeex';
import { UserRepository, User } from 'src/core';

@Update()
export class UserLangActions {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}
  @Action('uzbek')
  async uzbek(@Ctx() ctx: ContextType) {
    const newUser = this.userRepo.create({
      telegram_id: ctx.from?.id.toString(),
      lang: UserLang.UZ,
      username: ctx.from?.username || 'unknown',
      first_name: ctx.from?.first_name || 'unknown',
      last_name: ctx.from?.last_name || 'unknown',
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText('Til O`zbekcha qilib o`zgartirildi !');
  }

  @Action('russian')
  async russian(@Ctx() ctx: ContextType) {
    const newUser = this.userRepo.create({
      telegram_id: ctx.from?.id.toString(),
      lang: UserLang.RU,
      username: ctx.from?.username || 'unknown',
      first_name: ctx.from?.first_name || 'unknown',
      last_name: ctx.from?.last_name || 'unknown',
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText('Язык был изменен на русский!');
  }

  @Action('english')
  async english(@Ctx() ctx: ContextType) {
    const newUser = this.userRepo.create({
      telegram_id: ctx.from?.id.toString(),
      lang: UserLang.EN,
      username: ctx.from?.username || 'unknown',
      first_name: ctx.from?.first_name || 'unknown',
      last_name: ctx.from?.last_name || 'unknown',
    });
    await this.userRepo.save(newUser);
    await ctx.editMessageText('Language has been changed to English!');
  }
}
