import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // Check session on initial load
    const checkAuth = async () => {
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session?.user && !error) {
            setUser(session.user);
            setIsDemoUser(false);
            localStorage.removeItem('SI_BSDES_DEMO_ADMIN');
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase getSession note:', err);
        }
      }

      // Check local storage for demo session (if offline / demo mode)
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
      }

      setLoading(false);
    };

    checkAuth();

    // Listen to real-time auth changes from Supabase
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsDemoUser(false);
          localStorage.removeItem('SI_BSDES_DEMO_ADMIN');
        } else if (!localStorage.getItem('SI_BSDES_DEMO_ADMIN')) {
          setUser(null);
          setIsDemoUser(false);
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim();

    // 1. Prioritize Supabase Real Authentication
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });

        if (error) {
          // If login fails on Supabase Auth, check if it's the offline demo fallback
          if (cleanEmail === 'admin@mekarjaya.desa.id' && password === 'admin123') {
            const demoUser = {
              id: 'demo-admin-id',
              email: cleanEmail,
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

          // User-friendly error messages
          let userMsg = error.message;
          if (error.message.includes('Invalid login credentials')) {
            userMsg = 'Email atau kata sandi salah. Pastikan akun sudah terdaftar dan diverifikasi.';
          } else if (error.message.includes('Email not confirmed')) {
            userMsg = 'Email belum dikonfirmasi. Silakan centang "Auto Confirm" di dashboard Supabase.';
          }
          return { success: false, error: userMsg };
        }

        if (data?.user) {
          setUser(data.user);
          setIsDemoUser(false);
          localStorage.removeItem('SI_BSDES_DEMO_ADMIN');
          return { success: true, user: data.user };
        }
      } catch (err) {
        return { success: false, error: err.message || 'Gagal menghubungi server autentikasi.' };
      }
    }

    // 2. Offline / Local Demo Fallback
    if (cleanEmail === 'admin@mekarjaya.desa.id' && password === 'admin123') {
      const demoUser = {
        id: 'demo-admin-id',
        email: cleanEmail,
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

    return { success: false, error: 'Email atau kata sandi tidak valid.' };
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Logout note:', err);
      }
    }
    localStorage.removeItem('SI_BSDES_DEMO_ADMIN');
    localStorage.removeItem('SI_BSDES_ADMIN_TAB');
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
