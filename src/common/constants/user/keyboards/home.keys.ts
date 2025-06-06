import { Markup } from 'telegraf';

export const floorMenu: ReturnType<typeof Markup.keyboard> = Markup.keyboard([
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '10'],
  ['11', '12', '13', '14', '15'],
  ['16', '17', '18', '19', '20'],
]).resize();

export const roomsMenu: ReturnType<typeof Markup.keyboard> = Markup.keyboard([
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
]).resize();

export const contactButton = {
  uz: '📞 Telefon raqamni yuborish',
  ru: '📞 Отправить номер телефона',
  en: '📞 Send phone number',
};

export const homeAddressMenu: Record<
  string,
  ReturnType<typeof Markup.keyboard>
> = {
  uz: Markup.keyboard([
    ["Farg'ona shaxar makazi"],
    ['Toshkent shaxar makazi'],
  ]).resize(),
  ru: Markup.keyboard([
    ['Центр города Фергана'],
    ['Центр города Ташкент'],
  ]).resize(),
  en: Markup.keyboard([
    ['Fergana city center'],
    ['Tashkent city center'],
  ]).resize(),
};
