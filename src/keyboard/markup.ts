import { Markup } from 'telegraf'

export function getMainMenu() {
  return Markup.keyboard([
    ['пострйока дома', 'книги проектов'],
    ['индивидуальное проектирование',`лес`],
    [`информация о компании`]
  ]).resize()
}
export function yesNoKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback('Да', 'yes'),
    Markup.button.callback('Нет', 'no')
  ], { columns: 2 });
}