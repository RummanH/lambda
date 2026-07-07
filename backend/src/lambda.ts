import serverlessExpress from '@codegenie/serverless-express';
import type { Context, Handler } from 'aws-lambda';
import { createApp } from './bootstrap';

// Lambda entry point. Point API Gateway's Lambda proxy integration
// (REST API or HTTP API both work with serverless-express) at
// `dist/lambda.handler` once this is deployed.
//
// TODO(AWS): build/bundle this file (and node_modules) into the Lambda
// deployment package - `npm run build` alone only compiles TypeScript,
// it doesn't zip anything up.

// serverless-express's actual implementation only ever takes (event,
// context) - see node_modules/@codegenie/serverless-express/src/configure.js
// - even though its published types borrow aws-lambda's generic `Handler`,
// which declares a required 3rd `callback` param. Typing it narrowly here
// (with one cast where it's created) keeps every call site 2-arg only.
type ProxyHandler = (event: unknown, context: Context) => unknown;

let cachedHandler: ProxyHandler;

// Only 2 params (event, context) - no callback. Lambda's Node.js runtime
// inspects the handler's arity; declaring a 3rd (callback) parameter marks
// it as callback-style, which Node.js 24+ runtimes reject outright even if
// the callback is never invoked.
export const handler: Handler = async (event, context) => {
  // Reuse the Nest app + underlying Express server across warm
  // invocations instead of rebuilding the whole DI container every time.
  if (!cachedHandler) {
    const app = await createApp();
    await app.init();
    cachedHandler = serverlessExpress({
      app: app.getHttpAdapter().getInstance(),
    }) as unknown as ProxyHandler;
  }

  return cachedHandler(event, context);
};
