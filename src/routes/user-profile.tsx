import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useMatches } from '../context/MatchesContext';
import { db } from '../config/firebase';
import { ref, set, get, child, DatabaseReference, DataSnapshot, onValue } from 'firebase/database';
import { UserProps, PredictionProps } from '../interfaces'
import Navbar from '../components/Navbar';
import PredictionItem from '../components/PredictionItem';
import moment from 'moment'
import Header from '../components/Header'
import { PredictionsContainer } from '../components/Containers';



export default function UserProfile() {
  const currentUser = useAuth();
  const matches = useMatches();
  const { id } = useParams();
  const [loading, setLoading] = useState<Boolean>(true);
  const [user, setUser] = useState<UserProps | null>(null);
  const [userPredictions, setUserPredictions] = useState<PredictionProps[] | null>(null);

  const userRef: DatabaseReference = ref(db, `users/${id}`)
  useEffect(() => {
    const userRef: DatabaseReference = ref(db, `users/${id}`)
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const u: UserProps = { ...snapshot.val() };
        setUser(u);
        console.log(`predictions/${snapshot.key}`);
        const predictionsRef: DatabaseReference = ref(db, `predictions/${snapshot.key}`);
        onValue(predictionsRef, (snapshotPredictions) => {
          const predictionsList = new Map<string, PredictionProps>();
          matches?.forEach((match) => {
            predictionsList.set(match.id, { ...match, homePrediction: -1, awayPrediction: -1, points: -1, uid: id! });
          });
          snapshotPredictions.forEach((childSnapshot) => {
            const id = childSnapshot.key;
            if (id) {
              const item = predictionsList.get(id);
              if (item) {
                predictionsList.set(id, { ...item, ...childSnapshot.val() });
              }
            }
          });
          setUserPredictions(Array.from(predictionsList.values()));
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [matches]);


  if (!loading && !user) {
    return <Navigate to='/' replace={true} />;
  }

  let prevDate = '';
  let matchDate = '';

  return (
    <>
      <Navbar />
      <Header title={user? user.displayName : '--'} />
      <PredictionsContainer>
        {userPredictions && userPredictions?.map((match, index) => {
          matchDate = moment(match.date).format('dddd, MMMM DD, YYYY');
          if (matchDate != prevDate) {
            prevDate = matchDate;
            return (
              <>
                <div className="md:col-span-2 text-xl mt-4 bt-4">{matchDate}</div>
                <PredictionItem key={match.id} {...match} />
              </>
            );
          } else {
            prevDate = matchDate;
            return (
              <PredictionItem key={match.id} {...match} />
            );
          }
        })}
      </PredictionsContainer>
    </>
  );
}