'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, enableNetwork } from 'firebase/firestore'; 

interface OrgData {
  name: string;
  plan: string;
  ownerId: string;
}

interface AuthContextType {
  user: User | null;
  orgContext: OrgData | null;
  login: () => Promise<void>; 
  logout: () => Promise<void>; 
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, 
  orgContext: null,
  login: async () => {}, 
  logout: async () => {},
  loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orgContext, setOrgContext] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        
        setUser(u);
        try {
          await enableNetwork(db);
          const orgRef = doc(db, "organizations", u.uid);
          const orgSnap = await getDoc(orgRef);
          
          if (orgSnap.exists()) {
            setOrgContext(orgSnap.data() as OrgData);
          }
          
          const token = await u.getIdToken();
          fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          }).catch(() => {});
          
        } catch (error) {
          console.error("SaaS Context Load Error:", error);
        }
      } else {
        setUser(null);
        setOrgContext(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      
      const token = await result.user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) throw new Error("Cookie sync failed");

      window.location.href = '/dashboard';
      
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.warn("Authentication popup was closed or superseded.");
      } else {
        console.error("Login failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, orgContext, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);