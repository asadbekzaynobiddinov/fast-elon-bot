import * as dotenv from 'dotenv';

dotenv.config();

export type ConfigType = {
  PORT: number;
  DB_URL: string;
  TOKEN: string;
  HOME_ADMIN_CHANEL: string;
  HOME_MAIN_CHANEL: string;
  PHONE_ADMIN_CHANEL: string;
  PHONE_MAIN_CHANEL: string;
  PHONE_MAIN_URL: string;
  CAR_ADMIN_CHANEL: string;
  CAR_MAIN_CHANEL: string;
};

export const config: ConfigType = {
  PORT: Number(process.env.PORT),
  DB_URL: process.env.DB_URL as string,
  TOKEN: process.env.TOKEN as string,
  HOME_ADMIN_CHANEL: process.env.HOME_ADMIN_CHANEL as string,
  HOME_MAIN_CHANEL: process.env.HOME_MAIN_CHANEL as string,
  PHONE_ADMIN_CHANEL: process.env.PHONE_ADMIN_CHANEL as string,
  PHONE_MAIN_CHANEL: process.env.PHONE_MAIN_CHANEL as string,
  PHONE_MAIN_URL: process.env.PHONE_MAIN_URL as string,
  CAR_ADMIN_CHANEL: process.env.CAR_ADMIN_CHANEL as string,
  CAR_MAIN_CHANEL: process.env.CAR_MAIN_CHANEL as string,
};
