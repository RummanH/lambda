import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signInWithRedirect,
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

  logout(): void {
    // Local-only logout: wipes Amplify's cached tokens and reloads.
    // Doesn't invalidate the Cognito hosted-login session itself, so a
    // fresh Login click may silently sign back in without a password
    // prompt - deliberate tradeoff for a simpler demo flow, no redirect
    // to Cognito's logout endpoint.
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
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
