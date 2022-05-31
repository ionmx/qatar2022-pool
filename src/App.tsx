import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./config/firebase";
import { ref, onValue, DatabaseReference } from 'firebase/database';
import './App.css';
import { UserProps } from './interfaces'
import Navbar from "./components/Navbar";
import { DefaultContainer } from './components/Containers';
import MatchItem from './components/MatchItem'
import { useMatches } from './context/MatchesContext'
import moment from 'moment'


function App() {
  const [users, setUsers] = useState<UserProps[] | null>(null);
  const navigate = useNavigate();

  // TODO: Display current user position

  // TODO: Display today matches
  const matches = useMatches();

  const getOrdinalSuffix = ((n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  });

  useEffect(() => {
    const usersRef: DatabaseReference = ref(db, 'users');

    onValue(usersRef, (snapshot) => {
      if (snapshot.size > 0) {
        const usersList: UserProps[] = [];
        snapshot.forEach((childSnapshot) => {
          const id = childSnapshot.key;
          usersList.push({ id, ...childSnapshot.val() });
        });
        usersList.sort((a, b) => {
          return b.score - a.score;
        });
        let ranking = 0;
        let prevScore = 0;
        usersList.forEach((item) => {
          if (prevScore !== item.score) {
            ranking += 1;
          }
          item.ranking = ranking;
          prevScore = item.score;
        });
        setUsers(usersList);
      }
    });

  }, []);

  let matchDate = '';
  let currentDate = moment(new Date()).format('YYYYMMDD');
  currentDate = '20221121';  // FIXME: For dev purposes we use first match date 


  return (
    <>
      <Navbar />
      <DefaultContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-2xl my-4 font-bold text-gray-900">Today's games</h2>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {matches?.map((match) => {
                matchDate = moment(match.date).format('YYYYMMDD');
                if (matchDate === currentDate) {
                  return (
                    <MatchItem key={match.id} {...match} />
                  );
                } else {
                  return <Fragment key={match.id}></Fragment>;
                }
              })}
            </div>
          </div>
          <div>
            <h2 className="text-2xl my-4 font-bold text-gray-900">Leaderboard</h2>
            <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-2">
              <table className="w-full border-separate [border-spacing:0.75rem]">
                <tbody>
                  {users && users?.map((user) => {
                    return (
                      <tr key={user.id} onClick={() => navigate(`/user/${user.userName}`)} className="hover:cursor-pointer">
                        <td className="text-right text-gray-500">{user.ranking}<sup>{getOrdinalSuffix(user.ranking)}</sup></td>
                        <td className={`w-14 h-14 ranking-${user.ranking}`}><img className="h-12 w-12 rounded-full" alt={user.userName} src={user.photoURL} /></td>
                        <td className="text-xl">{user.displayName}</td>
                        <td className="text-right text-xl">{user.score}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </DefaultContainer>
    </>
  );
}


export default App;
