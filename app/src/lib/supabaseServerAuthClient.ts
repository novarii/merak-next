import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type SupabaseCookieOptions = {
  domain?: string;
  maxAge?: number;
  expires?: string | Date;
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  secure?: boolean;
  httpOnly?: boolean;
  priority?: 'low' | 'medium' | 'high';
};

const normalizeCookieOptions = (options?: SupabaseCookieOptions) => {
  if (!options) {
    return {};
  }

  const { expires, ...rest } = options;
  return {
    ...rest,
    ...(expires
      ? { expires: typeof expires === 'string' ? new Date(expires) : expires }
      : {}),
  };
};

const normalizeDeleteOptions = (options?: SupabaseCookieOptions) => {
  if (!options) {
    return {};
  }

  const deleteOptions: { domain?: string; path?: string } = {};
  if (options.domain) {
    deleteOptions.domain = options.domain;
  }
  if (options.path) {
    deleteOptions.path = options.path;
  }

  return deleteOptions;
};

const getEnv = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables');
  }

  return { supabaseUrl, supabaseAnonKey };
};

export const createSupabaseServerClient = async () => {
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // Server Components cannot modify cookies directly.
      },
      remove() {
        // Server Components cannot modify cookies directly.
      },
    },
  });
};

export const createSupabaseRouteHandlerClient = async () => {
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: SupabaseCookieOptions) {
        cookieStore.set({
          name,
          value,
          ...normalizeCookieOptions(options),
        });
      },
      remove(name: string, options?: SupabaseCookieOptions) {
        cookieStore.delete({
          name,
          ...normalizeDeleteOptions(options),
        });
      },
    },
  });
};
