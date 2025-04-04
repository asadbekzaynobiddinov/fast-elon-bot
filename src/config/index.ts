import * as dotenv from 'dotenv';

dotenv.config();

export type ConfigType = {
  PORT: number;
  DB_URL: string;
  TOKEN: string;
  HOME_ADMIN_CHANEL: string;
  HOME_MAIN_CHANEL: string;
};

export const config: ConfigType = {
  PORT: Number(process.env.PORT),
  DB_URL: process.env.DB_URL as string,
  TOKEN: process.env.TOKEN as string,
  HOME_ADMIN_CHANEL: process.env.HOME_ADMIN_CHANEL as string,
  HOME_MAIN_CHANEL: process.env.HOME_MAIN_CHANEL as string,
};
