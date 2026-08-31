import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';
import { getUserProfileFromFirestore, saveUserProfileToFirestore } from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, profile: Partial<UserProfile>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PROFILE_KEY = 'medinest_auth_profile_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch extended profile from Firestore
        const remoteProfile = await getUserProfileFromFirestore(currentUser.uid);
        if (remoteProfile) {
          setUserProfile(remoteProfile);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(remoteProfile));
        } else {
          const fallbackProfile: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Patient',
            phoneNumber: currentUser.phoneNumber || undefined,
            createdAt: new Date().toISOString()
          };
          setUserProfile(fallbackProfile);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(fallbackProfile));
          await saveUserProfileToFirestore(fallbackProfile);
        }
      } else {
        setUserProfile(null);
        localStorage.removeItem(LOCAL_PROFILE_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const remote = await getUserProfileFromFirestore(cred.user.uid);
    if (remote) {
      setUserProfile(remote);
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(remote));
    }
  };

  const signUpWithEmail = async (email: string, pass: string, extraProfile: Partial<UserProfile>) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (extraProfile.displayName) {
      await updateProfile(cred.user, { displayName: extraProfile.displayName });
    }
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName: extraProfile.displayName || email.split('@')[0] || 'Patient',
      phoneNumber: extraProfile.phoneNumber || '',
      age: extraProfile.age,
      gender: extraProfile.gender,
      insuranceProvider: extraProfile.insuranceProvider || '',
      createdAt: new Date().toISOString()
    };
    setUserProfile(newProfile);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
    await saveUserProfileToFirestore(newProfile);
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const existing = await getUserProfileFromFirestore(cred.user.uid);
    if (existing) {
      setUserProfile(existing);
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(existing));
    } else {
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || 'Patient',
        phoneNumber: cred.user.phoneNumber || '',
        createdAt: new Date().toISOString()
      };
      setUserProfile(newProfile);
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
      await saveUserProfileToFirestore(newProfile);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...(userProfile || {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Patient'
      }),
      ...data
    };
    setUserProfile(updated);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
    await saveUserProfileToFirestore(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        logout,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
