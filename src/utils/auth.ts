import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { AdminUser } from '../types';

export const AUTHORIZED_ADMIN_EMAILS = [
  'seeraajs1@gmail.com',
];

const AUTH_STORAGE_KEY = 'sat_admin_session_v1';
const PASS_STORAGE_KEY = 'sat_admin_pass_v1';

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.includes(normalized);
}

export function getCurrentAdmin(): AdminUser | null {
  const firebaseUser = auth.currentUser;
  if (firebaseUser && isAdminEmail(firebaseUser.email)) {
    return {
      email: firebaseUser.email?.trim().toLowerCase() || '',
      name: firebaseUser.displayName || 'Siraj Ahmed',
      signedInAt: Date.now(),
    };
  }

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
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password || password.trim().length === 0) {
    return Promise.resolve({
      success: false,
      error: 'Please enter your administrator email and password.',
    });
  }

  if (!isAdminEmail(normalizedEmail)) {
    return Promise.resolve({
      success: false,
      error: 'Unauthorized administrator email. Use the authorized Siraj Ahmed Tech admin account.',
    });
  }

  return signInWithEmailAndPassword(auth, normalizedEmail, password)
    .then((result) => {
      const userEmail = result.user.email?.trim().toLowerCase() || normalizedEmail;
      const user: AdminUser = {
        email: userEmail,
        name: result.user.displayName || 'Siraj Ahmed',
        signedInAt: Date.now(),
      };

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.warn('Error persisting admin session:', e);
      }

      return { success: true, user };
    })
    .catch((error) => {
      console.error('Firebase admin sign-in failed:', error);
      return {
        success: false,
        error: 'Unable to sign in with Firebase Authentication. Please verify the admin credentials.',
      };
    });
}

export function signOutAdmin(): Promise<void> {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.warn('Error removing admin session:', e);
  }
  return firebaseSignOut(auth);
}

export function subscribeToAdminAuth(
  onChange: (user: AdminUser | null) => void
) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      onChange(null);
      return;
    }

    if (!isAdminEmail(firebaseUser.email)) {
      console.warn('Authenticated Firebase user is not authorized for the admin dashboard:', firebaseUser.email);
      void firebaseSignOut(auth);
      onChange(null);
      return;
    }

    const managedUser: AdminUser = {
      email: firebaseUser.email!.trim().toLowerCase(),
      name: firebaseUser.displayName || 'Siraj Ahmed',
      signedInAt: Date.now(),
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(managedUser));
    } catch (error) {
      console.warn('Could not persist admin auth state:', error);
    }

    onChange(managedUser);
  });
}
