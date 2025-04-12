import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export type ContextType = Context &
  SceneContext & {
    session: {
      lang: string;
      lastMessage: any;
      home_id: string;
      phone_id: string;
    };
  };
