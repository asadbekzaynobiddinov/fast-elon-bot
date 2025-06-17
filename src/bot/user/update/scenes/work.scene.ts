/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Scene, SceneEnter, Ctx, On, Command } from 'nestjs-telegraf';
import { Work, WorkRepository } from 'src/core';
import { ContextType } from 'src/common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkType } from 'src/common/enum';
import {
  doneMessage,
  userMainMessage,
  usersMenu,
  workApplicationTimeMessages,
  workCancelMessages,
  workContactMessages,
  workDeadlineMessages,
  workDescriptionMessages,
  workInformationMessages,
  workLocationMessages,
  workNameMessages,
  workSalaryMessages,
} from 'src/common/constants';
import { Markup } from 'telegraf';
import { config } from 'src/config';

@Scene('workScene')
export class WorkScene {
  constructor(
    @InjectRepository(Work) private readonly workRepo: WorkRepository,
  ) {}
  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(workCancelMessages[ctx.session.lang] as string, {
      parse_mode: 'HTML',
    });
    const workAd = await this.workRepo.findOne({
      where: { id: ctx.session.work_id },
    });
    if (workAd?.type === WorkType.WORKJOBEMPLOYER) {
      await ctx.reply(workNameMessages[ctx.session.lang][0] as string);
      return;
    } else if (workAd?.type === WorkType.WORKJOBSEEKER) {
      await ctx.reply(workNameMessages[ctx.session.lang][1] as string);
      return;
    }
  }

  @Command('cancel')
  async cancel(@Ctx() ctx: ContextType) {
    await this.workRepo.delete({ id: ctx.session.work_id });
    ctx.session.work_id = '';
    ctx.session.lastMessage = await ctx.reply(
      userMainMessage[ctx.session.lang] as string,
      {
        reply_markup: usersMenu[ctx.session.lang],
      },
    );
    await ctx.scene.leave();
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const workAd = await this.workRepo.findOne({
      where: { id: ctx.session.work_id },
    });

    if (!workAd) {
      return;
    }

    switch (workAd.last_state) {
      case 'awaitName': {
        const name = (ctx.update as { message: { text: string } }).message.text;
        workAd.name = name;
        workAd.last_state = 'awaitLocation';
        await this.workRepo.save(workAd);
        if (workAd.type === WorkType.WORKJOBEMPLOYER) {
          await ctx.reply(workLocationMessages[ctx.session.lang][0] as string);
          return;
        } else if (workAd.type === WorkType.WORKJOBSEEKER) {
          await ctx.reply(workLocationMessages[ctx.session.lang][1] as string);
          return;
        }
        return;
      }
      case 'awaitLocation': {
        const location = (ctx.update as { message: { text: string } }).message
          .text;
        workAd.location = location;
        workAd.last_state = 'awaitInformation';
        await this.workRepo.save(workAd);
        if (workAd.type === WorkType.WORKJOBEMPLOYER) {
          await ctx.reply(
            workInformationMessages[ctx.session.lang][0] as string,
          );
          return;
        } else if (workAd.type === WorkType.WORKJOBSEEKER) {
          await ctx.reply(
            workInformationMessages[ctx.session.lang][1] as string,
          );
          return;
        }
        return;
      }
      case 'awaitInformation': {
        const information = (ctx.update as { message: { text: string } })
          .message.text;
        workAd.information = information;
        workAd.last_state = 'awaitDescription';
        await this.workRepo.save(workAd);
        if (workAd.type === WorkType.WORKJOBEMPLOYER) {
          await ctx.reply(
            workDescriptionMessages[ctx.session.lang][0] as string,
          );
          return;
        } else if (workAd.type === WorkType.WORKJOBSEEKER) {
          await ctx.reply(
            workDescriptionMessages[ctx.session.lang][1] as string,
          );
          return;
        }
        return;
      }
      case 'awaitDescription': {
        const description = (ctx.update as { message: { text: string } })
          .message.text;
        workAd.description = description;
        workAd.last_state = 'awaitDeadline';
        await this.workRepo.save(workAd);
        if (workAd.type === WorkType.WORKJOBEMPLOYER) {
          await ctx.reply(workDeadlineMessages[ctx.session.lang][0] as string);
          return;
        } else if (workAd.type === WorkType.WORKJOBSEEKER) {
          await ctx.reply(workDeadlineMessages[ctx.session.lang][1] as string);
          return;
        }
        return;
      }
      case 'awaitDeadline': {
        const deadline = (ctx.update as { message: { text: string } }).message
          .text;
        workAd.deadline = deadline;
        workAd.last_state = 'awaitSalary';
        await this.workRepo.save(workAd);
        if (workAd.type === WorkType.WORKJOBEMPLOYER) {
          await ctx.reply(workSalaryMessages[ctx.session.lang][0] as string);
          return;
        } else if (workAd.type === WorkType.WORKJOBSEEKER) {
          await ctx.reply(workSalaryMessages[ctx.session.lang][1] as string);
          return;
        }
        return;
      }
      case 'awaitSalary': {
        const salary = (ctx.update as { message: { text: string } }).message
          .text;
        workAd.salary = salary;
        workAd.last_state = 'awaitApplicationTime';
        await this.workRepo.save(workAd);
        if (workAd.type === WorkType.WORKJOBEMPLOYER) {
          await ctx.reply(
            workApplicationTimeMessages[ctx.session.lang][0] as string,
          );
          return;
        } else if (workAd.type === WorkType.WORKJOBSEEKER) {
          await ctx.reply(
            workApplicationTimeMessages[ctx.session.lang][1] as string,
          );
          return;
        }
        return;
      }
      case 'awaitApplicationTime': {
        const application_time = (ctx.update as { message: { text: string } })
          .message.text;
        workAd.application_time = application_time;
        workAd.last_state = 'awaitContact';
        await this.workRepo.save(workAd);
        await ctx.reply(workContactMessages[ctx.session.lang] as string);
        return;
      }
      case 'awaitContact': {
        const contact = (ctx.update as { message: { text: string } }).message
          .text;
        workAd.contact = contact;
        workAd.last_state = 'done';
        await this.workRepo.save(workAd);
        await ctx.reply(
          `Sizning e'loningiz tayyor!\n\n` +
            `🆔 <b>Id:</b> ${workAd.id}\n\n` +
            `${workAd.type === WorkType.WORKJOBEMPLOYER ? '<b>👔 Ish beruvchi: </b>' + workAd.name + '\n' : '<b>🔍 Ish izlovchi: </b>' + workAd.name + '\n'}` +
            `📍 <b>Manzil:</b> ${workAd.location}\n` +
            `ℹ️ <b>Ma'lumot:</b> ${workAd.information}\n` +
            `📝 <b>Izoh:</b> ${workAd.description}\n` +
            `⏳ <b>Davomiyligi:</b> ${workAd.deadline}\n` +
            `💰 <b>Maosh:</b> ${workAd.salary}\n` +
            `🕒 <b>Murojat qilish vaqti:</b> ${workAd.application_time}\n` +
            `📞 <b>Bog'lanish uchun:</b> ${workAd.contact}\n`,
          {
            parse_mode: 'HTML',
          },
        );
        await ctx.reply(
          doneMessage[ctx.session.lang] as string,
          Markup.removeKeyboard(),
        );
        await ctx.reply(userMainMessage[ctx.session.lang] as string, {
          reply_markup: usersMenu[ctx.session.lang],
        });
        await ctx.telegram.sendMessage(
          config.WORK_ADMIN_CHANEL,
          `Yangi e'lon!\n\n` +
            `🆔 <b>Id:</b> ${workAd.id}\n\n` +
            `${workAd.type === WorkType.WORKJOBEMPLOYER ? '<b>👔 Ish beruvchi: </b>' + workAd.name + '\n' : '<b>🔍 Ish izlovchi: </b>' + workAd.name + '\n'}` +
            `📍 <b>Manzil:</b> ${workAd.location}\n` +
            `ℹ️ <b>Ma'lumot:</b> ${workAd.information}\n` +
            `📝 <b>Izoh:</b> ${workAd.description}\n` +
            `⏳ <b>Davomiyligi:</b> ${workAd.deadline}\n` +
            `💰 <b>Maosh:</b> ${workAd.salary}\n` +
            `🕒 <b>Murojat qilish vaqti:</b> ${workAd.application_time}\n` +
            `📞 <b>Bog'lanish uchun:</b> ${workAd.contact}\n`,
          {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  Markup.button.callback(
                    '✅ Tasdiqlash',
                    `acceptWork=${workAd.id}`,
                  ),
                  Markup.button.callback(
                    '❌ Rad etish',
                    `rejectWork=${workAd.id}`,
                  ),
                ],
              ],
            },
          },
        );
        return;
      }
    }
  }

  @On('contact')
  async onContact(@Ctx() ctx: ContextType) {
    const workAd = await this.workRepo.findOne({
      where: { id: ctx.session.work_id },
    });
    if (!workAd) {
      return;
    }
    if (workAd.last_state != 'awaitContact') {
      return;
    }
    workAd.contact = (
      ctx.update as {
        message: {
          contact: {
            phone_number: string;
          };
        };
      }
    ).message.contact.phone_number;
    workAd.last_state = 'done';
    await this.workRepo.save(workAd);
    await ctx.reply(
      `Sizning e'loningiz tayyor!\n\n` +
        `🆔 <b>Id:</b> ${workAd.id}\n\n` +
        `${workAd.type === WorkType.WORKJOBEMPLOYER ? '<b>👔 Ish beruvchi: </b>' + workAd.name + '\n' : '<b>🔍 Ish izlovchi: </b>' + workAd.name + '\n'}` +
        `📍 <b>Manzil:</b> ${workAd.location}\n` +
        `ℹ️ <b>Ma'lumot:</b> ${workAd.information}\n` +
        `📝 <b>Izoh:</b> ${workAd.description}\n` +
        `⏳ <b>Davomiyligi:</b> ${workAd.deadline}\n` +
        `💰 <b>Maosh:</b> ${workAd.salary}\n` +
        `🕒 <b>Murojat qilish vaqti:</b> ${workAd.application_time}\n` +
        `📞 <b>Bog'lanish uchun:</b> ${workAd.contact}\n`,
      {
        parse_mode: 'HTML',
      },
    );
    await ctx.reply(
      doneMessage[ctx.session.lang] as string,
      Markup.removeKeyboard(),
    );
    await ctx.reply(userMainMessage[ctx.session.lang] as string, {
      reply_markup: usersMenu[ctx.session.lang],
    });
    await ctx.telegram.sendMessage(
      config.WORK_ADMIN_CHANEL,
      `Yangi e'lon!\n\n` +
        `🆔 <b>Id:</b> ${workAd.id}\n\n` +
        `${workAd.type === WorkType.WORKJOBEMPLOYER ? '<b>👔 Ish beruvchi: </b>' + workAd.name + '\n' : '<b>🔍 Ish izlovchi: </b>' + workAd.name + '\n'}` +
        `📍 <b>Manzil:</b> ${workAd.location}\n` +
        `ℹ️ <b>Ma'lumot:</b> ${workAd.information}\n` +
        `📝 <b>Izoh:</b> ${workAd.description}\n` +
        `⏳ <b>Davomiyligi:</b> ${workAd.deadline}\n` +
        `💰 <b>Maosh:</b> ${workAd.salary}\n` +
        `🕒 <b>Murojat qilish vaqti:</b> ${workAd.application_time}\n` +
        `📞 <b>Bog'lanish uchun:</b> ${workAd.contact}\n`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              Markup.button.callback(
                '✅ Tasdiqlash',
                `acceptWork=${workAd.id}`,
              ),
              Markup.button.callback('❌ Rad etish', `rejectWork=${workAd.id}`),
            ],
          ],
        },
      },
    );
  }
}
