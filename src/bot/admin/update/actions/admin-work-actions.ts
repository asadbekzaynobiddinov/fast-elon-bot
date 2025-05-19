/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Action, Update, Ctx } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Work, WorkRepository } from 'src/core';
import { ContextType } from 'src/common/types';
import { config } from 'src/config';
import { WorkType } from 'src/common/enum';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guard/admin.guard';

@UseGuards(AdminGuard)
@Update()
export class AdminWorkActions {
  constructor(
    @InjectRepository(Work) private readonly workRepo: WorkRepository,
  ) {}

  @Action(/acceptWork/)
  async adminWork(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');
    const workAd = await this.workRepo.findOne({
      where: { id },
    });
    if (!workAd) {
      return;
    }
    await ctx.telegram.sendMessage(
      config.WORK_MAIN_CHANEL,
      `📢 <b>Yangi e'lon!</b>\n\n` +
        `🆔 <b>Id:</b> ${workAd.id}\n\n` +
        `${workAd.type === WorkType.WORKJOBEMPLOYER ? `👔 <b>Ish beruvchi:</b> ${workAd.name}\n` : `🔍 <b>Ish izlovchi:</b> ${workAd.name}\n`}` +
        `📍 <b>Manzil:</b> ${workAd.location}\n` +
        `ℹ️ <b>Ma'lumot:</b> ${workAd.information}\n` +
        `📝 <b>Izoh:</b> ${workAd.description}\n` +
        `⏳ <b>Davomiyligi:</b> ${workAd.deadline}\n` +
        `💰 <b>Maosh:</b> ${workAd.salary}\n` +
        `🕒 <b>Murojat qilish vaqti:</b> ${workAd.application_time}\n` +
        `📞 <b>Bog'lanish uchun:</b> ${workAd.contact}\n\n` +
        `<a href="https://t.me/${ctx.botInfo.username}">E'lon berish uchun bosing</a>`,
      {
        parse_mode: 'HTML',
      },
    );
    await ctx.editMessageText(
      `Yangi e'lon!\n\n` +
        `🆔 <b>Id:</b> ${workAd.id}\n\n` +
        `${workAd.type === WorkType.WORKJOBEMPLOYER ? `👔 <b>Ish beruvchi:</b> ${workAd.name}\n` : `🔍 <b>Ish izlovchi:</b> ${workAd.name}\n`}` +
        `📍 <b>Manzil:</b> ${workAd.location}\n` +
        `ℹ️ <b>Ma'lumot:</b> ${workAd.information}\n` +
        `📝 <b>Izoh:</b> ${workAd.description}\n` +
        `⏳ <b>Davomiyligi:</b> ${workAd.deadline}\n` +
        `💰 <b>Maosh:</b> ${workAd.salary}\n` +
        `🕒 <b>Murojat qilish vaqti:</b> ${workAd.application_time}\n` +
        `📞 <b>Bog'lanish uchun:</b> ${workAd.contact}\n` +
        `✅ <b>Qabul qilindi</b>\n`,
      {
        parse_mode: 'HTML',
      },
    );
  }

  @Action(/rejectWork/)
  async rejectWork(@Ctx() ctx: ContextType) {
    const [, id] = (ctx.update as any).callback_query.data.split('=');
    const workAd = await this.workRepo.findOne({
      where: { id },
    });
    if (!workAd) {
      return;
    }
    await ctx.editMessageText(
      `Yangi e'lon!\n\n` +
        `🆔 <b>Id:</b> ${workAd.id}\n\n` +
        `📍 <b>Manzil:</b> ${workAd.location}\n` +
        `ℹ️ <b>Ma'lumot:</b> ${workAd.information}\n` +
        `📝 <b>Izoh:</b> ${workAd.description}\n` +
        `⏳ <b>Davomiyligi:</b> ${workAd.deadline}\n` +
        `💰 <b>Maosh:</b> ${workAd.salary}\n` +
        `🕒 <b>Murojat qilish vaqti:</b> ${workAd.application_time}\n` +
        `📞 <b>Bog'lanish uchun:</b> ${workAd.contact}\n` +
        `❌ <b>Rad etildi</b>\n`,
      {
        parse_mode: 'HTML',
      },
    );
    await this.workRepo.delete(id as string);
  }
}
