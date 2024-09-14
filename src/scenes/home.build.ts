import { Scenes } from 'telegraf';
import fs from 'fs';
import { getMainMenu } from '../keyboard/markup';

// Определяем интерфейс сессии
export interface MyWizardSession extends Scenes.WizardSessionData {
  data: {
    floors?: string;
    material?: string;
    location?: string;
    size?: string;
    contact_number?: string;
  };
}

// Определяем интерфейс контекста доделать
export interface MyContext extends Scenes.WizardContext<MyWizardSession> {}
export const homeBuildingWizard = new Scenes.WizardScene<any>(
  'home-building',
  (ctx) => {
    // Инициализация объекта data в state
    ctx.wizard.state.data = { floors: '', material: '', location: '', size: '' };
    ctx.reply('Сколько этажей?');
    return ctx.wizard.next();
  },
  (ctx) => {
    const message = ctx.message as { text: string }; // Приведение типа к текстовому сообщению
    ctx.wizard.state.data.floors = message.text; // Сохранение данных в state
    ctx.reply('Какой материал?');
    return ctx.wizard.next();
  },
  (ctx) => {
    const message = ctx.message as { text: string };
    ctx.wizard.state.data.material = message.text; // Сохранение данных
    ctx.reply('Локация?');
    return ctx.wizard.next();
  },
  (ctx) => {
    const message = ctx.message as { text: string };
    ctx.wizard.state.data.location = message.text; // Сохранение данных
    ctx.reply('Метраж?');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const message = ctx.message as { text: string };
    ctx.wizard.state.data.size = message.text;

    const data = ctx.wizard.state.data;
    const logData = `Сколько этажей: ${data.floors}\nМатериал: ${data.material}\nЛокация: ${data.location}\nМетраж: ${data.size}\n\n`;
    fs.appendFileSync('txtdoc/home_building_data.txt', logData, 'utf8');
    try {
      await ctx.telegram.sendMessage(process.env.MANAGER_CHAT_ID, `Новая заявка на строительство дома:\n${logData}`);
      await ctx.reply('Спасибо за ответы! Ваши данные были отправлены менеджерам.');
    } catch (error) {
      console.error('Error sending message:', error);
      await ctx.reply('Произошла ошибка при отправке данных менеджерам.');
    }

    // Возвращаем пользователя на главное меню
    await ctx.reply('Выберите дальнейшее действие:', getMainMenu());

    return ctx.scene.leave(); // Возвращаем "void" или "Promise<void>"
  }
);
