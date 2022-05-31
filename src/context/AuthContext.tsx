import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, FirebaseUser } from "../config/firebase";
import { ref, set, get, child, DatabaseReference, DataSnapshot } from "firebase/database";
import BouncingBall from "../components/BouncingBall";

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
      if (u) {
        const dbRef: DatabaseReference = ref(db);
        get(child(dbRef, `users/${u?.uid}`)).then((snapshot: DataSnapshot) => {
          // Add user if doesn't exists
          const email = '' + u.email;
          const username =  email.substring(0, email.lastIndexOf("@"));
          // TODO: Search for duplicated username
          if (!snapshot.exists()) {
            set(ref(db, `users/${u?.uid}`), {
              email: email,
              userName: username, 
              displayName: u?.displayName,
              photoURL: u?.photoURL,
              score: 0
            });
          }
        }).catch((error: Error) => {
          console.error(error);
        });
        setUser(u);
        setAuthLoading(false);
      } else {
        setAuthLoading(false);
      }
    });
  }, []);

  if (authLoading) {
    return <BouncingBall/>;
  }
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}