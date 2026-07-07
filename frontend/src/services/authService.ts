/**
 * Placeholder auth service.
 *
 * TODO(AWS): Replace this in-memory/localStorage stand-in with real calls
 * into AWS Cognito, either via the `amazon-cognito-identity-js` SDK or
 * (preferred) `aws-amplify`'s Auth module. That will handle the actual
 * SRP login flow, token refresh, and secure storage.
 */

const ACCESS_TOKEN_KEY = 'demo_access_token';
const EMAIL_KEY = 'demo_email';
const USER_ID_KEY = 'demo_user_id';

class AuthService {
  async login(email: string, password: string): Promise<void> {
    // TODO(AWS): call Cognito's InitiateAuth (USER_PASSWORD_AUTH flow) or
    // Amplify's `signIn({ username, password })` here, then store the
    // real access token / id token / sub returned by Cognito.
    void password; // not used yet - password isn't sent anywhere in this demo

    const fakeAccessToken = `fake-access-token-for-${email}`;
    const fakeUserId = `fake-user-id-${email}`;

    localStorage.setItem(ACCESS_TOKEN_KEY, fakeAccessToken);
    localStorage.setItem(EMAIL_KEY, email);
    localStorage.setItem(USER_ID_KEY, fakeUserId);
  }

  logout(): void {
    // TODO(AWS): call Cognito's GlobalSignOut / Amplify's `signOut()` so
    // the refresh token is revoked server-side, not just cleared locally.
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }

  getAccessToken(): string | null {
    // TODO(AWS): once Amplify is integrated, prefer reading the current
    // session's access token (with automatic refresh) instead of a raw
    // localStorage value.
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  getEmail(): string | null {
    return localStorage.getItem(EMAIL_KEY);
  }

  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }
}

export const authService = new AuthService();
