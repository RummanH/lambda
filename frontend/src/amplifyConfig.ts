import { Amplify } from 'aws-amplify';

// Wires the app up to your Cognito User Pool's Hosted UI. All the values
// below come from the App Client you create in the Cognito console - see
// NEXT-STEPS.txt / the Cognito integration guide for exactly where to find
// each one (User Pool ID, App Client ID, and the Cognito domain you pick
// when enabling Hosted UI).
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          // Must be a subset of the OAuth scopes enabled on the App Client
          // in the Cognito console (Hosted UI settings) - requesting one
          // that isn't enabled there fails with invalid_scope.
          scopes: ['openid', 'email'],
          redirectSignIn: [import.meta.env.VITE_APP_URL],
          redirectSignOut: [import.meta.env.VITE_APP_URL],
          responseType: 'code',
        },
      },
    },
  },
});
