import type { Session } from '@supabase/supabase-js';

export interface AccountNavigation {
  isAuthenticated: boolean;
  accountLink: string;
  accountLabel: string;
}

export const deriveAccountNavigation = (session: Session | null | undefined): AccountNavigation => {
  const isAuthenticated = Boolean(session);

  return {
    isAuthenticated,
    accountLink: isAuthenticated ? '/profile' : '/login',
    accountLabel: isAuthenticated ? 'Profile' : 'Log In',
  };
};
