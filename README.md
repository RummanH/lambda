# AWS Cognito + Lambda Demo

A minimal full-stack demo that lays the groundwork for integrating **AWS
Cognito** (authentication) and **AWS Lambda / API Gateway** (protected API)
into a React + NestJS app. No AWS resources are configured here - the app
is just shaped so those pieces can be dropped in later.

## Project structure

```
demo/
  frontend/   React + Vite + TypeScript
  backend/    NestJS + TypeScript
```

## Running locally

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:3000

# Frontend (in a separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

Open the frontend, click **Login** (this stores a fake token - no real
auth happens yet), then go back to Home and click **Call Protected API**
to see the NestJS `/profile` endpoint echo the token back.

## Current flow (what's implemented today)

```
React  →  NestJS  →  Protected Endpoint
```

- The frontend's `authService` fakes a login and stores a placeholder
  access token in `localStorage`.
- `api.ts` (Axios) attaches that token as `Authorization: Bearer <token>`
  on every request.
- The NestJS backend's `AuthGuard` only checks that an `Authorization`
  header exists - it does **not** validate the token in any way.

## Future AWS flow (what this app is prepared for)

```
React
  ↓
AWS Cognito Login
  ↓
Access Token
  ↓
API Gateway
  ↓
Lambda OR NestJS
  ↓
Business Logic
```

### Where to plug in AWS pieces later

| Concern | Where | Notes |
|---|---|---|
| Cognito login/signup | `frontend/src/services/authService.ts` | Replace the fake `login`/`logout`/`getAccessToken` bodies with calls into `aws-amplify` (`Auth.signIn`, `Auth.signOut`, `Auth.currentSession`) or `amazon-cognito-identity-js` directly. See the `TODO(AWS)` comments in that file. |
| Storing/refreshing tokens | `frontend/src/services/authService.ts` | Amplify handles secure storage + silent refresh automatically once integrated. |
| Attaching tokens to requests | `frontend/src/services/api.ts` | Already attaches `Authorization: Bearer <token>` - just make sure the token source is the real Cognito session. |
| API base URL | `frontend/.env` (`VITE_API_URL`) | Point this at the API Gateway invoke URL once deployed, instead of `localhost:3000`. |
| JWT verification | `backend/src/auth/auth.guard.ts` | Currently only checks the header exists. Replace with real signature/issuer/expiry verification (e.g. `aws-jwt-verify` against the Cognito User Pool's JWKS), or rely on an API Gateway Cognito authorizer to reject bad tokens upstream. |
| API Gateway | n/a (infra, not code) | Sits in front of Lambda and can enforce a Cognito authorizer before requests reach `/profile`. Point it at `dist/lambda.handler` via a Lambda proxy integration (REST API or HTTP API both work). |
| Lambda | `backend/src/lambda.ts` | Already wired up - see below. |

All of the above are marked with `TODO(AWS)` comments at their exact
locations in the source so they're easy to find later.

## Backend: already Lambda-ready

The NestJS backend has **two entry points**, both built from the same
`bootstrap.ts` (so they configure the Nest app identically):

- `backend/src/main.ts` - starts a normal listening server. Only used for
  local dev (`npm run dev` / `npm start`). **Never runs inside Lambda.**
- `backend/src/lambda.ts` - exports `handler`, the function Lambda
  actually invokes. It wraps the Nest app with
  [`@codegenie/serverless-express`](https://github.com/CodeGenieApp/serverless-express)
  so API Gateway's proxy-integration event/response shape gets translated
  to/from a normal Express request, and caches the app across warm
  invocations so it isn't rebuilt on every call.

To deploy:

1. `npm run build` (compiles `src/` → `dist/`, including `dist/lambda.js`).
2. Bundle `dist/`, `node_modules`, and `package.json` into a zip (or a
   container image) - `nest build` only compiles TypeScript, it does not
   package a deployable artifact.
3. Create the Lambda function with handler `dist/lambda.handler` (or
   `lambda.handler` depending on how you structure the zip).
4. Point an API Gateway Lambda proxy integration at that function.

No AWS resources (the Lambda function, API Gateway, IAM roles, etc.) are
created by this repo - that part is still on you, as requested.
