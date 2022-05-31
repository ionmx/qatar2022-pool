import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, FirebaseUser } from "../config/firebase";
import { ref, set, get, child, DatabaseReference, DataSnapshot } from "firebase/database";
import BouncingBall from "../components/BouncingBall";

interface AuthProviderProps {
  children?: JSX.Element | JSX.Element[];
};

interface AuthContextProps {
  user: FirebaseUser | null | undefined;
  userName: string | null | undefined;
}

//export const AuthContext = createContext<FirebaseUser | null>(null);
export const AuthContext = createContext<AuthContextProps | null>(null);

//export function useAuth(): FirebaseUser | null {
export function useAuth(): AuthContextProps | null {
  const context = useContext(AuthContext);
  //if (!context) throw new Error("There is no Auth provider");
  return context;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userName, setUserName] = useState('');
  const [authLoading, setAuthLoading] = useState<Boolean>(true);

  useEffect(() => {
    auth.onAuthStateChanged(u => {
      if (u) {
        const dbRef: DatabaseReference = ref(db);
        get(child(dbRef, `users/${u?.uid}`)).then((snapshot: DataSnapshot) => {
          
          // Add user if doesn't exists
          if (!snapshot.exists()) {
            const email = '' + u.email;
            // TODO: Search for duplicated username
            const username =  email.substring(0, email.lastIndexOf("@"));
            setUserName(username);
            set(ref(db, `users/${u?.uid}`), {
              email: email,
              userName: username, 
              displayName: u?.displayName,
              photoURL: u?.photoURL,
              score: 0
            });
          } else {
            setUserName(snapshot.val().userName);
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
    <AuthContext.Provider value={{user, userName}}>
      {children}
    </AuthContext.Provider>
  );
}