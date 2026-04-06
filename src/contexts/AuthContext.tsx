/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User,
  updateProfile as firebaseUpdateProfile,
  deleteUser as firebaseDeleteUser,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebase-applet-config.json';
import { deleteUserData } from '@/src/services/workService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    // Force account selection to help debug
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      console.log('Starting sign in with popup...');
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', result.user.email);
    } catch (error: any) {
      console.error('Error signing in:', error);
      let message = 'Error al iniciar sesión';
      
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'La ventana de inicio de sesión fue cerrada';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'Solicitud de inicio de sesión cancelada';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'Este dominio no está autorizado en Firebase. Por favor, añade los dominios de AI Studio en la consola de Firebase.';
      } else if (error.message) {
        message = `Error: ${error.message}`;
      }
      
      setAuthError(message);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await firebaseSignInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      setAuthError(error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await firebaseCreateUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      setAuthError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) return;
    try {
      await firebaseUpdateProfile(auth.currentUser, { displayName, photoURL });
      // Force refresh user state
      setUser({ ...auth.currentUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    try {
      // First clean up Supabase data
      await deleteUserData(userId);
      // Then delete Firebase Auth account
      await firebaseDeleteUser(auth.currentUser);
      setUser(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, signIn, signInWithEmail, signUpWithEmail, signOut, updateProfile, deleteAccount }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
