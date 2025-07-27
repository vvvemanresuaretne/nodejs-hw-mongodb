import { config } from 'dotenv';
import { setupServer } from './src/server.js';
import { initMongoConnection } from './src/db/initMongoConnection.js';
import { Contact } from './src/models/сontact.js'; // 👈 импорт модели контактов

config();

(async () => {
  await initMongoConnection();

  // Отримаємо всіх контактів
  const allContacts = await Contact.find();
  console.log(allContacts);

  // Запуск сервера
  setupServer();

  console.log("App is starting...");
})();
