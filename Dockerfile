# Используем легкий Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем весь код
COPY . .

# Устанавливаем необходимые зависимости
RUN npm install express telegraf dotenv ts-node nodemon @types/node @types/express

# Открываем порт, если это необходимо
EXPOSE 3000

# Команда для запуска приложения через ts-node
CMD ["npx", "nodemon", "--watch", "src", "--exec", "npx ts-node ./src/index.ts"]