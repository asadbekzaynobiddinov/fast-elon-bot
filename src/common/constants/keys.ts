import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const userMenu: Record<string, InlineKeyboardMarkup> = {
  uz: {
    inline_keyboard: [
      [Markup.button.callback(`📢 E'lon berish`, 'create_ad')],
      [Markup.button.callback('⚙️ Sozlamalar', 'settings')],
    ],
  },
  ru: {
    inline_keyboard: [
      [Markup.button.callback('📢 Создать объявление', 'create_ad')],
      [Markup.button.callback('⚙️ Настройки', 'settings')],
    ],
  },
  en: {
    inline_keyboard: [
      [Markup.button.callback('📢 Create an ad', 'create_ad')],
      [Markup.button.callback('⚙️ Settings', 'settings')],
    ],
  },
};

export const settingsMenu: Record<string, InlineKeyboardMarkup> = {
  uz: {
    inline_keyboard: [
      [Markup.button.callback('🔄 Tilni o‘zgartirish', 'change_lang')],
      [Markup.button.callback('🔙 Orqaga', 'backToMenu')],
    ],
  },
  ru: {
    inline_keyboard: [
      [Markup.button.callback('🔄 Изменить язык', 'change_lang')],
      [Markup.button.callback('🔙 Назад', 'backToMenu')],
    ],
  },
  en: {
    inline_keyboard: [
      [Markup.button.callback('🔄 Change language', 'change_lang')],
      [Markup.button.callback('🔙 Back', 'backToMenu')],
    ],
  },
};
