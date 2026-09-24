import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { admin, landlord, tenants, users } from '@/data/mock';
import type { User, UserRole } from '@/types';

type SignInResult = { ok: true; user: User } | { ok: false; error: string };

interface SessionValue {
  user: User | null;
  signIn: (identifier: string, password: string) => SignInResult;
  signInAsDemo: (role: UserRole) => User;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);
const digits = (v: string) => v.replace(/\D/g, '');

// TODO(supabase): replace with supabase.auth (session persistence, onAuthStateChange, and a
// profile/role lookup). Never trust a role sent from the client for authorization: enforce it
// with Row Level Security on the database.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback((identifier: string, password: string): SignInResult => {
    const id = identifier.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === id || (digits(id).length >= 9 && digits(u.phone).endsWith(digits(id).slice(-9))),
    );
    if (!found) return { ok: false, error: 'We could not find an account with those details. Try a demo account below.' };
    if (password.length < 6) return { ok: false, error: 'That password is not correct.' };
    if (found.status === 'suspended') return { ok: false, error: 'This account is suspended. Please contact support.' };
    setUser(found);
    return { ok: true, user: found };
  }, []);

  const signInAsDemo = useCallback((role: UserRole): User => {
    let demo: User;
    if (role === 'landlord') demo = landlord;
    else if (role === 'tenant') demo = tenants[0];
    else if (role === 'admin') demo = admin;
    else {
      demo = { id: `u-demo-${role}`, role, fullName: 'Demo User', email: `${role}@example.com`, phone: '0700 000 000', status: 'active', createdAt: new Date().toISOString() };
    }
    setUser(demo);
    return demo;
  }, []);

  const signOut = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, signIn, signInAsDemo, signOut }), [user, signIn, signInAsDemo, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
