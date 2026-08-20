import { AdminUser } from '../types';

export const AUTHORIZED_ADMIN_EMAILS = [
  'seeraajs@gmail.com',
  'seeraajs1@gmail.com',
];

const AUTH_STORAGE_KEY = 'sat_admin_session_v1';
const PASS_STORAGE_KEY = 'sat_admin_pass_v1';

export function isAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.includes(normalized);
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed: AdminUser = JSON.parse(saved);
      if (parsed && isAdminEmail(parsed.email)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading admin session:', e);
  }
  return null;
}

export function getStoredPassword(): string | null {
  try {
    return localStorage.getItem(PASS_STORAGE_KEY);
  } catch (e) {
    console.warn('Error reading stored password:', e);
  }
  return null;
}

export function setStoredPassword(newPass: string): void {
  try {
    localStorage.setItem(PASS_STORAGE_KEY, newPass);
  } catch (e) {
    console.warn('Error saving password:', e);
  }
}

export function signInAdmin(
  email: string,
  password: string
): { success: boolean; error?: string; user?: AdminUser } {
  const normalizedEmail = email.trim().toLowerCase();

  // Validate email authorization
  if (!isAdminEmail(normalizedEmail)) {
    return {
      success: false,
      error: 'Invalid administrator email or unauthorized credentials.',
    };
  }

  // Validate password presence
  if (!password || password.trim().length === 0) {
    return {
      success: false,
      error: 'Please enter your administrator password.',
    };
  }

  // Check stored password if one was explicitly set by user, otherwise save and allow login
  const storedPass = getStoredPassword();
  if (storedPass) {
    if (password !== storedPass) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }
  } else {
    // Save the initial administrator password for this browser session.
    setStoredPassword(password);
  }

  const user: AdminUser = {
    email: normalizedEmail,
    name: 'Siraj Ahmed',
    signedInAt: Date.now(),
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Error persisting session:', e);
  }

  return {
    success: true,
    user,
  };
}

export function signOutAdmin(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.warn('Error removing session:', e);
  }
}
