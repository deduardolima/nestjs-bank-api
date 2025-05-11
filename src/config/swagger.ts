import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Backend Bank API')
  .setDescription('Documentação do app back-end para operações bancárias.')
  .setVersion('1.0')
  .build();
