import * as dotenv from 'dotenv';
dotenv.config();

export type ConfigType = {
  PORT: number;
  DB_URL: string;
  TOKEN: string;
};

export const config: ConfigType = {
  PORT: Number(process.env.PORT),
  DB_URL: process.env.DB_URL as string,
  TOKEN: process.env.TOKEN as string,
};
