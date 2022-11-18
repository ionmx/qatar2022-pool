import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react'
import { useMatches } from '../context/MatchesContext';
import { db } from '../config/firebase';
import { get, ref, orderByChild, equalTo, query, DatabaseReference, onValue } from 'firebase/database';
import { UserProps, PredictionProps } from '../interfaces'
import Navbar from '../components/Navbar';
import PredictionItem from '../components/PredictionItem';
import moment from 'moment'
import { PredictionsContainer } from '../components/Containers';

export default function UserProfile() {
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
  }, [matches, id]);


  if (!loading && !user) {
    return <Navigate to='/' replace={true} />;
  }

  let prevDate = '';
  let matchDate = '';

  return (
    <>
      <Navbar />
      <header className="bg-white md:block px-2 py-4 top-16 relative border-b-4  border-[#faa458]">
        { user && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <table className="w-full">
            <tbody>
              <tr>
                <td className={`w-14 h-14 ranking-${user.ranking}`}><img className="h-12 w-12 rounded-full" alt={user.userName} src={user.photoURL} /></td>
                <td className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c6004c] to-[#8d1946]">{user.displayName}</td>
                <td className="text-right text-xl">{user.score} points</td>
              </tr>
            </tbody>
          </table>
          </div>
        )}
      </header>
      <PredictionsContainer>
        {userPredictions && userPredictions?.map((match, index) => {
          matchDate = moment(match.date).format('dddd, MMMM DD, YYYY');
          if (matchDate !== prevDate) {
            prevDate = matchDate;
            return (
              <Fragment key={match.id}>
                <div className="md:col-span-2 text-xl mt-4 bt-4">{matchDate}</div>
                <PredictionItem {...match} />
              </Fragment>
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