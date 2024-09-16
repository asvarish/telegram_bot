import express from 'express';
import { Telegraf, session, Scenes } from 'telegraf';
import dotenv from 'dotenv';
import { getMainMenu } from './keyboard/markup';
import { homeBuildingWizard, MyContext } from './scenes/home.build'; // Импортируем MyContext

dotenv.config();

const app = express();

// Используем импортированный MyContext
const stage = new Scenes.Stage<MyContext>([homeBuildingWizard]);

if (!process.env.TOKEN) {
  throw new Error('Bot token is not defined in the environment variables.');
}

const bot = new Telegraf<MyContext>(process.env.TOKEN);

// Использование сессий и сцен
bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => {
  ctx.replyWithPhoto(
    { source: './image/welcome_image.jpg' },
    {
      caption: 'Приветствую в <b>Grand House Bot</b>\n\n' +
        'выберете интересующий вас вариант',
      parse_mode: 'HTML',
      ...getMainMenu(),
    }
  );
});

// Обработчик всех текстовых сообщений, который дублирует сообщения в чат менеджеров
bot.on('text', async (ctx,next) => {
  // Получаем текст сообщения пользователя
  const userMessage = ctx.message.text;

  // Отправляем сообщение в чат менеджеров
  try {
    // Отправляем сообщение в чат с менеджерами, используя chat_id из переменных окружения
    await ctx.telegram.sendMessage(
      process.env.MANAGER_CHAT_ID!,
      `Пользователь: @${ctx.from?.username || 'без имени'}\nСообщение: ${userMessage}`
    );
  } catch (error) {
    console.error('Ошибка при отправке сообщения менеджерам:', error);
  }
  await next();
})
bot.hears('пострйока дома', (ctx) => {
  ctx.scene.enter('home-building'); // Вход в сцену
});

bot.on('text', ctx => {
  ctx.reply('just text');
});

bot.on('sticker', ctx => {
  ctx.reply('Прикольный стикер');
});

bot.launch();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

