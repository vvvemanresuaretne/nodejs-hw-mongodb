import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';

const pathToSwagger = path.join(process.cwd(), 'docs', 'swagger.json');

export const setupSwagger = () => {
  try {
    const fileContent = fs.readFileSync(pathToSwagger, 'utf-8');  // Передаём переменную, а не строку
    const swaggerDoc = JSON.parse(fileContent);
    return [swaggerUi.serve, swaggerUi.setup(swaggerDoc)];
  } catch (err) {
    console.error('Failed to load swagger specs:', err);
    return (req, res) =>
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        errors: 'Failed to load swagger specs',
      });
  }
};
