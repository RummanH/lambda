import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Shared by both entry points so the Nest app is configured identically
// whether it's run locally (main.ts) or inside Lambda (lambda.ts).
export async function createApp() {
  const app = await NestFactory.create(AppModule);

  // TODO(AWS): once deployed behind API Gateway, CORS can instead be
  // configured on the API Gateway resource and this can be tightened
  // (or removed here entirely).
  app.enableCors();

  return app;
}
