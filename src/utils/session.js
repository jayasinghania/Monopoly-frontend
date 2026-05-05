// Session persistence so a page reload can rejoin an in-progress game.
// Wrapped in try/catch because localStorage can throw in private browsing
// or sandboxed contexts.

const KEY = 'monopoly:session';

export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.name || !parsed?.code) return null;
    return { name: String(parsed.name), code: String(parsed.code).toUpperCase() };
  } catch {
    return null;
  }
}

export function saveSession(name, code) {
  if (!name || !code) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ name, code }));
  } catch {
    // ignore — storage might be disabled
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}