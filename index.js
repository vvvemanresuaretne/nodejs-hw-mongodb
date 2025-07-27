import { config } from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { Contact } from './models/сontact.js'; // 👈 импорт модели контактов

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
