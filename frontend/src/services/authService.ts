import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signInWithRedirect,
  signOut,
} from 'aws-amplify/auth';

/**
 * Thin wrapper around Amplify's Cognito Hosted UI flow.
 *
 * login() sends the browser to Cognito's own hosted login/sign-up page
 * (configured in amplifyConfig.ts) - there's no local email/password form.
 * Cognito redirects back to VITE_APP_URL once the user is authenticated,
 * and Amplify handles exchanging the auth code for tokens automatically.
 */
class AuthService {
  async login(): Promise<void> {
    // Navigates the browser away - nothing to await a result from here.
    await signInWithRedirect();
  }

  async logout(): Promise<void> {
    // Also redirects to Cognito's logout endpoint and back, since OAuth
    // is configured in amplifyConfig.ts.
    await signOut();
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() ?? null;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getAccessToken()) !== null;
  }

  async getEmail(): Promise<string | null> {
    try {
      const attributes = await fetchUserAttributes();
      return attributes.email ?? null;
    } catch {
      return null;
    }
  }

  async getUserId(): Promise<string | null> {
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
