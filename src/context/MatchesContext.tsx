import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { ref, onValue, DatabaseReference } from "firebase/database";
import { MatchProps } from '../interfaces'

interface MatchProviderProps {
  children?: JSX.Element | JSX.Element[];
};

export const MatchesContext = createContext<MatchProps[] | null>(null);

export function useMatches(): MatchProps[] | null {
  const context = useContext(MatchesContext);
  return context;
}

export function MatchesProvider({ children }: MatchProviderProps): JSX.Element {
  const [matches, setMatches] = useState<MatchProps[]>([]);
  const [matchesLoading, setMatchesLoading] = useState<Boolean>(true);

  useEffect(() => {

    const matchesRef: DatabaseReference = ref(db, 'matches');
    onValue(matchesRef, (snapshot) => {

      const matchesList: MatchProps[] = [];
      if (snapshot.size > 0) {
        snapshot.forEach((childSnapshot) => {
          const id = childSnapshot.key;
          matchesList.push({ id, ...childSnapshot.val() });
        });
        setMatches(matchesList);
        setMatchesLoading(false);
      }
    });

  }, []);

  if (matchesLoading) {
    return <></>
  } 
  return (
    <MatchesContext.Provider value={matches}>
      {children}
    </MatchesContext.Provider>
  );
}