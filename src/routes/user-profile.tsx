import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useMatches } from '../context/MatchesContext';
import { db } from '../config/firebase';
import { get, ref, orderByChild, equalTo, query, DatabaseReference, onValue } from 'firebase/database';
import { UserProps, PredictionProps } from '../interfaces'
import Navbar from '../components/Navbar';
import PredictionItem from '../components/PredictionItem';
import moment from 'moment'
import Header from '../components/Header'
import { PredictionsContainer } from '../components/Containers';


export default function UserProfile() {
  const currentUser = useAuth()?.user;
  const matches = useMatches();
  const { id } = useParams();
  const [loading, setLoading] = useState<Boolean>(true);
  const [user, setUser] = useState<UserProps | null>(null);
  const [userPredictions, setUserPredictions] = useState<PredictionProps[] | null>(null);

  
  useEffect(() => {
    const q = query(ref(db, 'users'), orderByChild('userName'), equalTo(`${id}`));
    get(q).then((snapshot) => {
      if (snapshot.exists()) {
        const k: string = Object.keys(snapshot.val())[0];
        const u: UserProps = { ...snapshot.val()[k] };
        setUser(u);
        const predictionsRef: DatabaseReference = ref(db, `predictions/${k}`);
        onValue(predictionsRef, (snapshotPredictions) => {
          const predictionsList = new Map<string, PredictionProps>();
          matches?.forEach((match) => {
            predictionsList.set(match.id, { ...match, homePrediction: -1, awayPrediction: -1, points: -1, uid: k! });
          });
          snapshotPredictions.forEach((childSnapshot) => {
            const childId = childSnapshot.key;
            if (childId) {
              const item = predictionsList.get(childId);
              if (item) {
                predictionsList.set(childId, { ...item, ...childSnapshot.val() });
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