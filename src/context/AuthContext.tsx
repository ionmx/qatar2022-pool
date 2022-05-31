import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, FirebaseUser } from "../config/firebase";
import { ref, set, get, child, query, orderByChild, equalTo, DatabaseReference, DataSnapshot } from "firebase/database";
import BouncingBall from "../components/BouncingBall";
import moment from "moment"

interface AuthProviderProps {
  children?: JSX.Element | JSX.Element[];
};

interface AuthContextProps {
  user: FirebaseUser | null | undefined;
  userName: string | null | undefined;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth(): AuthContextProps | null {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userName, setUserName] = useState('');
  const [authLoading, setAuthLoading] = useState<Boolean>(true);

  useEffect(() => {
    auth.onAuthStateChanged(u => {
      setUser(u);
      if (u) {
        const dbRef: DatabaseReference = ref(db);
        get(child(dbRef, `users/${u?.uid}`)).then((snapshot: DataSnapshot) => {
          // Add user if doesn't exists
          if (!snapshot.exists()) {
            const email = '' + u.email;
            let username: string = email.substring(0, email.lastIndexOf("@"));

            // Search for duplicated username
            const q = query(ref(db, 'users'), orderByChild('userName'), equalTo(`${username}`));
            get(q).then((userSnapshot) => {
              console.log('YA CORRIO')
              if (userSnapshot.exists()) {
                // Duplicated, change username
                username = `${username}-${moment(new Date()).format("MMDDHHmmss")}`;
              }
              setUserName(username);
              set(ref(db, `users/${u?.uid}`), {
                email: email,
                userName: username,
                displayName: u?.displayName,
                photoURL: u?.photoURL,
                score: 0
              });
            });
          } else {
            setUserName(snapshot.val().userName);
          }
          setAuthLoading(false);
        }).catch((error: Error) => {
          console.error(error);
        });
      } else {
        setAuthLoading(false);
      }
    });
  }, []);

  if (authLoading) {
    return <BouncingBall />;
  }
  return (
    <AuthContext.Provider value={{ user, userName }}>
      {children}
    </AuthContext.Provider>
  );
}