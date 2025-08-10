import { config } from 'dotenv';
import { setupServer } from './src/server.js';  
import { initMongoConnection } from './src/db/initMongoConnection.js';

config();

(async () => {
  await initMongoConnection();

  // Можно убрать тестовый вызов после проверки:
  // const allContacts = await Contact.find();
  // console.log(allContacts);

  setupServer();

  // Обычно Express сам пишет в консоль при запуске, но можно оставить свой:
  // console.log("App is starting...");
})();
