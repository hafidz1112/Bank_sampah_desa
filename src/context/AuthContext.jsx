import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // Check local storage for demo session or supabase session
    const checkAuth = async () => {
      const savedDemo = localStorage.getItem('SI_BSDES_DEMO_ADMIN');
      if (savedDemo === 'true') {
        setUser({
          id: 'demo-admin-id',
          email: 'admin@mekarjaya.desa.id',
          user_metadata: {
            full_name: 'Pengurus Bank Sampah Mekarjaya',
            role: 'operator'
          }
        });
        setIsDemoUser(true);
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            setIsDemoUser(false);
          }
        } catch (err) {
          console.warn('Supabase getSession error:', err);
        }
      }
      setLoading(false);
    };

    checkAuth();

    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsDemoUser(false);
          localStorage.removeItem('SI_BSDES_DEMO_ADMIN');
        } else if (!localStorage.getItem('SI_BSDES_DEMO_ADMIN')) {
          setUser(null);
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    // 1. Check if user wants demo quick login
    if (
      (email === 'admin@mekarjaya.desa.id' && password === 'admin123') ||
      (!isSupabaseConfigured())
    ) {
      const demoUser = {
        id: 'demo-admin-id',
        email: email || 'admin@mekarjaya.desa.id',
        user_metadata: {
          full_name: 'Operator Bank Sampah Mekarjaya',
          role: 'operator',
          dusun: 'Desa Mekarjaya'
        }
      };
      localStorage.setItem('SI_BSDES_DEMO_ADMIN', 'true');
      setUser(demoUser);
      setIsDemoUser(true);
      return { success: true, user: demoUser };
    }

    // 2. Try Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setUser(data.user);
        setIsDemoUser(false);
        localStorage.removeItem('SI_BSDES_DEMO_ADMIN');
        return { success: true, user: data.user };
      } catch (err) {
        return { success: false, error: err.message || 'Login gagal' };
      }
    }

    return { success: false, error: 'Kredensial tidak valid' };
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase && !isDemoUser) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem('SI_BSDES_DEMO_ADMIN');
    setUser(null);
    setIsDemoUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemoUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
