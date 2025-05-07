import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const usersMenu: Record<string, InlineKeyboardMarkup> = {
  uz: {
    inline_keyboard: [
      [Markup.button.callback('🏠 Uy Zona', 'home')],
      [
        Markup.button.callback('📱 Telefonlar', 'phones'),
        Markup.button.callback('🚗 Avtomobil', 'cars'),
      ],
      [
        Markup.button.callback('💼 Ish', 'work'),
        Markup.button.callback("🏪 Do'konlar", 'shops'),
      ],
      [
        Markup.button.callback('🛒 Buyuyrtma', 'order'),
        Markup.button.callback('⚙️ Sozlamalar', 'settings'),
      ],
      [Markup.button.callback('🌐 Tilni o`zgartirish', 'changeLang')],
    ],
  },
  ru: {
    inline_keyboard: [
      [Markup.button.callback('🏠 Дом Зона', 'home')],
      [
        Markup.button.callback('📱 Телефоны', 'phones'),
        Markup.button.callback('🚗 Автомобиль', 'cars'),
      ],
      [
        Markup.button.callback('💼 Работа', 'work'),
        Markup.button.callback('🏪 Магазины', 'shops'),
      ],
      [
        Markup.button.callback('🛒 Заказ', 'order'),
        Markup.button.callback('⚙️ Настройки', 'settings'),
      ],
      [Markup.button.callback('🌐 Изменить язык', 'changeLang')],
    ],
  },
  en: {
    inline_keyboard: [
      [Markup.button.callback('🏠 Home Zone', 'home')],
      [
        Markup.button.callback('📱 Phones', 'phones'),
        Markup.button.callback('🚗 Cars', 'cars'),
      ],
      [
        Markup.button.callback('💼 Work', 'work'),
        Markup.button.callback('🏪 Shops', 'shops'),
      ],
      [
        Markup.button.callback('🛒 Order', 'order'),
        Markup.button.callback('⚙️ Settings', 'settings'),
      ],
      [Markup.button.callback('🌐 Change Language', 'changeLang')],
    ],
  },
};

export const homeMenu: Record<string, InlineKeyboardMarkup> = {
  uz: {
    inline_keyboard: [
      [Markup.button.callback("🏠 Ko'chmas mulk", 'realEstate')],
      [Markup.button.callback('🏢 Ijara', 'rent')],
      [Markup.button.callback('◀️ Orqaga', 'backFromHomeMenu')],
    ],
  },
  ru: {
    inline_keyboard: [
      [Markup.button.callback('🏠 Недвижимость', 'realEstate')],
      [Markup.button.callback('🏢 Аренда', 'rent')],
      [Markup.button.callback('◀️ Назад', 'backFromHomeMenu')],
    ],
  },
  en: {
    inline_keyboard: [
      [Markup.button.callback('🏠 Real Estate', 'realEstate')],
      [Markup.button.callback('🏢 Rent', 'rent')],
      [Markup.button.callback('◀️ Back', 'backFromHomeMenu')],
    ],
  },
};

export const phoneMenu: Record<string, InlineKeyboardMarkup> = {
  uz: {
    inline_keyboard: [
      [
        Markup.button.callback('📱 Iphone', 'iphone'),
        Markup.button.callback('🤖 Android', 'android'),
      ],
    ],
  },
  ru: {
    inline_keyboard: [
      [
        Markup.button.callback('📱 Айфон', 'iphone'),
        Markup.button.callback('🤖 Андроид', 'android'),
      ],
    ],
  },
  en: {
    inline_keyboard: [
      [
        Markup.button.callback('📱 iPhone', 'iphone'),
        Markup.button.callback('🤖 Android', 'android'),
      ],
    ],
  },
};

export const backFromPhomeMenu = {
  uz: '◀️ Orqaga',
  ru: '◀️ Назад',
  en: '◀️ Back',
};

export const additionalKeyForPhone = {
  uz: '🛒 Sotib olish',
  ru: '🛒 Купить',
  en: '🛒 Buy',
};

export const workMenu: Record<string, InlineKeyboardMarkup> = {
  uz: {
    inline_keyboard: [
      [
        Markup.button.callback('💼 Ish Beruvchi', 'workEmployer'),
        Markup.button.callback('👨‍💻 Ish Izlovchi', 'workJobSeeker'),
      ],
      [Markup.button.callback('◀️ Orqaga', 'backFromWorkMenu')],
    ],
  },
};
