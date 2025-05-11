import { Command, Update, Ctx, On, Action } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { AdminRepository, Admin, HomeRepository, Home } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeType } from 'src/common/enum';
import { Markup } from 'telegraf';

@Update()
export class AdminCommands {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: AdminRepository,
    @InjectRepository(Home) private readonly homeRepo: HomeRepository,
  ) {}

  @Command('admin')
  async start(@Ctx() ctx: ContextType) {
    const admin = await this.adminRepo.findOne({
      where: { telegram_id: ctx.from?.id.toString() },
    });
    if (!admin) {
      return;
    }
    await ctx.reply('/search - Uy elonlarini qidirish');
  }

  @Command('search')
  async search(@Ctx() ctx: ContextType) {
    const admin = await this.adminRepo.findOne({
      where: { telegram_id: ctx.from?.id.toString() },
    });
    if (!admin) {
      return;
    }
    admin.last_state = 'searchingHomes';
    await this.adminRepo.save(admin);
    await ctx.reply('Qidirish uchun id kiriting');
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const admin = await this.adminRepo.findOne({
      where: { telegram_id: ctx.from?.id.toString() },
    });
    if (!admin || admin.last_state !== 'searchingHomes') {
      return;
    }
    const id = (ctx.update as { message: { text: string } }).message.text;
    const homeAdd = await this.homeRepo.findOne({
      where: { id },
    });
    if (!homeAdd) {
      await ctx.reply('Bunday uy topilmadi');
      return;
    }
    const message =
      `🆔 <b>Id:</b> ${homeAdd.id}\n\n` +
      (homeAdd.type == HomeType.REAL_ESTATE
        ? '<b>Uy sotiladi.</b>\n\n'
        : '<b>Uy ijaraga beriladi.</b>\n\n') +
      `📍 <b>Manzili:</b> ${homeAdd.location}\n` +
      `🏢 <b>Qavatlar soni:</b> ${homeAdd.floors_of_building}\n` +
      `🏬 <b>Uy joylashgan qavati:</b> ${homeAdd.floor_number}\n` +
      `🛏️ <b>Xonalar soni:</b> ${homeAdd.rooms}\n` +
      `📐 <b>Uy maydoni:</b> ${homeAdd.square}\n` +
      `💰 <b>Narx:</b> ${homeAdd.price}\n` +
      `📞 <b>Bog'lanish uchun:</b> ${homeAdd.number_for_contact}\n` +
      `ℹ️ <b>Qo'shimcha ma'lumotlar:</b> ${homeAdd.additional_information}\n\n` +
      `${homeAdd.is_available ? 'Hozirda mavjud ✅' : 'Ijaraga berilgan ❌'}`;
    await ctx.sendPhoto(homeAdd.pictures[0], {
      caption: message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            Markup.button.callback(
              'Mijozga topshirish',
              `giveToClient=${homeAdd.id}`,
            ),
          ],
        ],
      },
    });
  }

  @Action(/giveToClient/)
  async giveToClient(@Ctx() ctx: ContextType) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const [, id] = (ctx.update as any).callback_query.data.split('=');
    const homeAdd = await this.homeRepo.findOne({
      where: { id: id as string },
    });
    const admin = await this.adminRepo.findOne({
      where: { telegram_id: ctx.from?.id.toString() },
    });
    if (!admin) {
      await ctx.answerCbQuery('Siz admin emassiz', {
        show_alert: true,
      });
      return;
    }
    if (!homeAdd) {
      return;
    }
    if (!homeAdd.is_available) {
      await ctx.answerCbQuery('Bu uy allaqachon mijozga topshirilgan', {
        show_alert: true,
      });
      return;
    }
    homeAdd.is_available = false;
    await this.homeRepo.save(homeAdd);
    await ctx.editMessageCaption(
      `🆔 <b>Id:</b> ${homeAdd.id}\n\n` +
        (homeAdd.type == HomeType.REAL_ESTATE
          ? '<b>Uy sotiladi.</b>\n\n'
          : '<b>Uy ijaraga beriladi.</b>\n\n') +
        `📍 <b>Manzili:</b> ${homeAdd.location}\n` +
        `🏢 <b>Qavatlar soni:</b> ${homeAdd.floors_of_building}\n` +
        `🏬 <b>Uy joylashgan qavati:</b> ${homeAdd.floor_number}\n` +
        `🛏️ <b>Xonalar soni:</b> ${homeAdd.rooms}\n` +
        `📐 <b>Uy maydoni:</b> ${homeAdd.square}\n` +
        `💰 <b>Narx:</b> ${homeAdd.price}\n` +
        `📞 <b>Bog'lanish uchun:</b> ${homeAdd.number_for_contact}\n` +
        `ℹ️ <b>Qo'shimcha ma'lumotlar:</b> ${homeAdd.additional_information}\n\n` +
        `Ijaraga berildi ❌`,
      {
        parse_mode: 'HTML',
      },
    );
    admin.last_state = '';
    await this.adminRepo.save(admin);
  }
}
