// store.ts — read/write the GitHub PAT in localStorage.
// The token never leaves the browser except in Authorization headers
// to api.github.com.

const TOKEN_KEY = 'wiki_admin_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage unavailable (privacy mode, etc.) — fall through silently;
    // the user will be re-prompted next visit.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // see above.
  }
}
