import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./config/firebase";
import { ref, set, onValue, DatabaseReference } from 'firebase/database';
import './App.css';
import { MatchProps, UserProps } from './interfaces'
import Navbar from "./components/Navbar";
import { DefaultContainer } from './components/Containers';
import MatchItem from './components/MatchItem'
import { useMatches } from './context/MatchesContext'
import moment from 'moment'


function App() {
  const [users, setUsers] = useState<UserProps[] | null>(null);
  const navigate = useNavigate();
  const currentDate = moment(new Date()).format('YYYYMMDD');

  // TODO: Display current user position

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

  const updateScores = async() => {
    const date = new Date();
    let currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const competition = 'af79lqrc0ntom74zq13ccjslo';
    const data_url = `https://api.fifa.com/api/v3/calendar/matches?count=500&from=${currentDate}T00:00:00Z&to=${currentDate}T23:59:59Z&idCompetition=${competition}&count=500`

    fetch(data_url)
      .then((response) => response.json())
      .then((data) => {
        data.Results.forEach((item: any) => {
          if (matches) {
            for (let i = 0; i < matches?.length; i++) {
              if (matches[i].fifaId === item.IdMatch) {
                if (matches[i].homeScore !== item.Home.Score) {
                  set(ref(db, `matches/${matches[i].game}/homeScore`), item.Home.Score);
                }
                if (matches[i].awayScore !== item.Away.Score) {
                  set(ref(db, `matches/${matches[i].game}/awayScore`), item.Away.Score);
                }
                break;
              }
            }
          }
        });
      });
  }

  let matchDate = '';
  return (
    <>
      <Navbar />
      <DefaultContainer>
        <div onClick={updateScores}>CALL getScores</div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
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
