import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, FirebaseUser } from "../config/firebase";
import { ref, set, get, child, DatabaseReference, DataSnapshot } from "firebase/database";

interface AuthProviderProps {
  children?: JSX.Element | JSX.Element[];
};

export const AuthContext = createContext<FirebaseUser | null>(null);

export function useAuth(): FirebaseUser | null {
  const context = useContext(AuthContext);
  //if (!context) throw new Error("There is no Auth provider");
  return context;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [authLoading, setAuthLoading] = useState<Boolean>(true)

  useEffect(() => {
    auth.onAuthStateChanged(u => {
      setUser(u);
      if (u) {
        const dbRef: DatabaseReference = ref(db);
        get(child(dbRef, `users/${u?.uid}`)).then((snapshot: DataSnapshot) => {
          // Add user if doesn't exists
          if (!snapshot.exists()) {
            set(ref(db, `users/${u?.uid}`), {
              email: u?.email,
              displayName: u?.displayName,
              photoURL: u?.photoURL,
              score: 0
            });
          }
        }).catch((error: Error) => {
          console.error(error);
        });
        setAuthLoading(false);
      } else {
        setAuthLoading(false);
      }
    });
  }, []);

  // if (authLoading) {
  //   return <></>
  // } 
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}