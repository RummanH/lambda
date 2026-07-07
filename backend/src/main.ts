import { createApp } from './bootstrap';

// Local dev entry point only - run via `npm run dev`.
// TODO(AWS): the deployed entry point is lambda.ts, not this file. This
// file (and `app.listen`) never runs inside Lambda.
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
