import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export type CustomContext = Context &
  SceneContext & {
    session: {
      lang: string;
      lastMessage: any;
    };
  };
